#!/usr/bin/env node
/**
 * linear-cli.js — Cliente Linear centralizado do esquadrão OpenClaw
 * 
 * Uso:
 *   node linear-cli.js create --title "..." --desc "..." --labels "agent:keymaker,type:feature" --teamKey SQD
 *   node linear-cli.js update <issueId> --state "Em Testes"
 *   node linear-cli.js comment <issueId> --text "PRD finalizado"
 *   node linear-cli.js list-states --teamKey SQD
 *   node linear-cli.js list-labels --teamKey SQD
 * 
 * Autenticação: lê ~/.linear-token (nunca args/env inline)
 */

import { LinearClient } from '@linear/sdk';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// --- Auth ---
function loadToken() {
  const tokenPath = join(homedir(), '.linear-token');
  try {
    return readFileSync(tokenPath, 'utf8').trim();
  } catch (e) {
    process.stderr.write(`ERRO: Não foi possível ler ~/.linear-token: ${e.message}\n`);
    process.exit(1);
  }
}

// --- Arg parser simples ---
function parseArgs(argv) {
  const args = { flags: {}, positional: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      args.flags[key] = argv[i + 1] ?? true;
      i++;
    } else {
      args.positional.push(argv[i]);
    }
  }
  return args;
}

// --- UUID resolvers ---
async function resolveTeamId(client, teamKey) {
  const teams = await client.teams();
  const team = teams.nodes.find(t => t.key === teamKey || t.name === teamKey);
  if (!team) {
    process.stderr.write(`ERRO: Team "${teamKey}" não encontrado. Teams disponíveis: ${teams.nodes.map(t => `${t.name}(${t.key})`).join(', ')}\n`);
    process.exit(1);
  }
  return team.id;
}

async function resolveStateId(client, teamId, stateName) {
  const states = await client.workflowStates({ filter: { team: { id: { eq: teamId } } } });
  const state = states.nodes.find(s => s.name.toLowerCase() === stateName.toLowerCase());
  if (!state) {
    const available = states.nodes.map(s => s.name).join(', ');
    process.stderr.write(`ERRO: State "${stateName}" não encontrado. States disponíveis: ${available}\n`);
    process.exit(1);
  }
  return state.id;
}

async function resolveLabelIds(client, teamId, labelNames) {
  const labels = await client.issueLabels({ filter: { team: { id: { eq: teamId } } } });
  const result = [];
  for (const name of labelNames) {
    const label = labels.nodes.find(l => l.name.toLowerCase() === name.toLowerCase());
    if (!label) {
      process.stderr.write(`AVISO: Label "${name}" não encontrada — será ignorada.\n`);
    } else {
      result.push(label.id);
    }
  }
  return result;
}

// --- Comandos ---
async function cmdCreate(client, args) {
  const { title, desc, labels, teamKey = 'LIN', state } = args.flags;
  if (!title) { process.stderr.write('ERRO: --title é obrigatório\n'); process.exit(1); }

  const teamId = await resolveTeamId(client, teamKey);
  const labelIds = labels ? await resolveLabelIds(client, teamId, labels.split(',').map(s => s.trim())) : [];
  const stateId = state ? await resolveStateId(client, teamId, state) : undefined;

  const input = { title, teamId, labelIds };
  if (desc) input.description = desc;
  if (stateId) input.stateId = stateId;

  const result = await client.createIssue(input);
  const issue = await result.issue;
  const issueState = await issue.state;
  const issueLabels = await issue.labels();

  const output = {
    ticketId: issue.identifier,
    id: issue.id,
    title: issue.title,
    url: issue.url,
    state: issueState?.name,
    labels: issueLabels.nodes.map(l => l.name),
  };
  process.stdout.write(JSON.stringify(output, null, 2) + '\n');
}

async function cmdUpdate(client, args) {
  const issueIdOrKey = args.positional[1];
  if (!issueIdOrKey) { process.stderr.write('ERRO: informe o ID do ticket (ex: LIN-42)\n'); process.exit(1); }

  // A API não suporta filter por identifier — usa searchIssues para resolver
  const results = await client.searchIssues(issueIdOrKey);
  const issue = results.nodes.find(i => i.identifier === issueIdOrKey);
  if (!issue) { process.stderr.write(`ERRO: Ticket "${issueIdOrKey}" não encontrado\n`); process.exit(1); }

  const team = await issue.team;
  const teamId = team.id;

  const update = {};
  if (args.flags.state) {
    update.stateId = await resolveStateId(client, teamId, args.flags.state);
  }
  if (args.flags.labels) {
    update.labelIds = await resolveLabelIds(client, teamId, args.flags.labels.split(',').map(s => s.trim()));
  }

  await client.updateIssue(issue.id, update);

  const updated = await client.issue(issue.id);
  const updatedState = await updated.state;
  const updatedLabels = await updated.labels();

  const output = {
    ticketId: updated.identifier,
    id: updated.id,
    title: updated.title,
    url: updated.url,
    newState: updatedState?.name,
    assignedLabels: updatedLabels.nodes.map(l => l.name),
  };
  process.stdout.write(JSON.stringify(output, null, 2) + '\n');
}

async function cmdComment(client, args) {
  const issueIdOrKey = args.positional[1];
  const { text } = args.flags;
  if (!issueIdOrKey) { process.stderr.write('ERRO: informe o ID do ticket\n'); process.exit(1); }
  if (!text) { process.stderr.write('ERRO: --text é obrigatório\n'); process.exit(1); }

  // Resolve identifier → UUID via search
  const results = await client.searchIssues(issueIdOrKey);
  const issue = results.nodes.find(i => i.identifier === issueIdOrKey);
  if (!issue) { process.stderr.write(`ERRO: Ticket "${issueIdOrKey}" não encontrado\n`); process.exit(1); }

  await client.createComment({ issueId: issue.id, body: text });
  process.stdout.write(JSON.stringify({ ticketId: issue.identifier, comment: text, status: 'ok' }, null, 2) + '\n');
}

async function cmdListStates(client, args) {
  const teamKey = args.flags.teamKey ?? 'LIN';
  const teamId = await resolveTeamId(client, teamKey);
  const states = await client.workflowStates({ filter: { team: { id: { eq: teamId } } } });
  const output = states.nodes.map(s => ({ id: s.id, name: s.name, type: s.type }));
  process.stdout.write(JSON.stringify(output, null, 2) + '\n');
}

async function cmdListLabels(client, args) {
  const teamKey = args.flags.teamKey ?? 'LIN';
  const teamId = await resolveTeamId(client, teamKey);
  const labels = await client.issueLabels({ filter: { team: { id: { eq: teamId } } } });
  const output = labels.nodes.map(l => ({ id: l.id, name: l.name }));
  process.stdout.write(JSON.stringify(output, null, 2) + '\n');
}

function showHelp() {
  process.stdout.write(`
linear-cli.js — Cliente Linear centralizado do esquadrão OpenClaw

Comandos:
  create   --title "..." [--desc "..."] [--labels "agent:keymaker,type:feature"] [--teamKey SQD] [--state "Backlog"]
  update   <ticketId>   [--state "Em Testes"] [--labels "agent:arquiteto"]
  comment  <ticketId>   --text "mensagem"
  list-states  [--teamKey SQD]
  list-labels  [--teamKey SQD]

Autenticação: ~/.linear-token (Personal API Key do Linear)

Exemplos:
  node linear-cli.js create --title "Implementar feature X" --labels "agent:keymaker,type:feature"
  node linear-cli.js update SQD-42 --state "Em Testes"
  node linear-cli.js comment SQD-42 --text "PRD validado pelo Arquiteto"
  node linear-cli.js list-states
`);
}

// --- Main ---
async function main() {
  const argv = process.argv.slice(2);
  const args = parseArgs(argv);
  const command = args.positional[0];

  if (!command || command === '--help' || command === 'help') {
    showHelp();
    return;
  }

  const token = loadToken();
  const client = new LinearClient({ apiKey: token });

  try {
    switch (command) {
      case 'create':       await cmdCreate(client, args); break;
      case 'update':       await cmdUpdate(client, args); break;
      case 'comment':      await cmdComment(client, args); break;
      case 'list-states':  await cmdListStates(client, args); break;
      case 'list-labels':  await cmdListLabels(client, args); break;
      default:
        process.stderr.write(`ERRO: Comando desconhecido "${command}". Use --help.\n`);
        process.exit(1);
    }
  } catch (err) {
    process.stderr.write(`ERRO na API Linear: ${err.message}\n`);
    process.exit(1);
  }
}

main();
