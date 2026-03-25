#!/usr/bin/env python3
"""Fix Jim Hudson node (round 2) — address bot review findings.

1. Remove duplicate meeting observation (obs[2] vs obs[6])
   - Replace old obs[2] with labeled version, remove obs[6]
2. Fix 'DHS Secretary Jim Hudson' in Dennis Milligan observations
   - Change to 'DFA Secretary Jim Hudson'

Run from repo root:
  python fix-hudson-node-v2.py
  git add assets/js/network-graph.json
  git rm fix-hudson-node-v2.py
  git commit --amend --no-edit
  git push origin fix-network-graph-hudson --force-with-lease
"""
import json
import sys

path = 'assets/js/network-graph.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Fix 1: Jim Hudson node — deduplicate meeting observation
for node in data['nodes']:
    if node['id'] == 'Jim Hudson':
        print(f'Jim Hudson: {len(node["observations"])} observations before fix')
        
        # Find and remove the old unlabeled meeting observation
        old_meeting = None
        labeled_meeting = None
        for i, obs in enumerate(node['observations']):
            if obs.startswith('Met with Larry Berman, Milligan'):
                old_meeting = i
            if obs.startswith('APRIL 15, 2025 MEETING:'):
                labeled_meeting = i
        
        if old_meeting is not None and labeled_meeting is not None:
            # Remove the old unlabeled one
            print(f'  Removing duplicate obs[{old_meeting}]: {node["observations"][old_meeting][:80]}...')
            del node['observations'][old_meeting]
        elif old_meeting is not None and labeled_meeting is None:
            # Replace old with labeled
            node['observations'][old_meeting] = (
                'APRIL 15, 2025 MEETING: Met with Lawrence Berman (Israel Bonds NMD), '
                'Dennis Milligan, and Jason Brady at 3:00 PM in Auditor\u2019s Capitol Office '
                'Room 230 (AUDIT-JUN25-0002, AUDIT-JUN25-0050).'
            )
            print(f'  Replaced obs[{old_meeting}] with labeled version')
        
        node['observationCount'] = len(node['observations'])
        print(f'  Now {node["observationCount"]} observations')
        for i, obs in enumerate(node['observations']):
            print(f'  [{i}] {obs[:100]}...' if len(obs) > 100 else f'  [{i}] {obs}')
        break

# Fix 2: Dennis Milligan node — DHS -> DFA
fixed_milligan = 0
for node in data['nodes']:
    if node['id'] == 'Dennis Milligan':
        for i, obs in enumerate(node['observations']):
            if 'DHS Secretary Jim Hudson' in obs:
                node['observations'][i] = obs.replace('DHS Secretary Jim Hudson', 'DFA Secretary Jim Hudson')
                fixed_milligan += 1
                print(f'\nMilligan obs[{i}]: fixed DHS -> DFA')
                print(f'  {node["observations"][i][:120]}...' if len(node['observations'][i]) > 120 else f'  {node["observations"][i]}')
        break

print(f'\nFixed {fixed_milligan} Milligan observation(s)')

# Also check Auditor as Israel Bonds Coordinator and April 2025 Israel Bonds Tour nodes
for node in data['nodes']:
    for i, obs in enumerate(node['observations']):
        if 'DHS Secretary' in obs and node['id'] != 'Dennis Milligan':
            old = obs
            node['observations'][i] = obs.replace('DHS Secretary', 'DFA Secretary')
            print(f'\n{node["id"]} obs[{i}]: fixed DHS -> DFA')

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write('\n')

print(f'\nWrote {path}')
