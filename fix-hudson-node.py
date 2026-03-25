#!/usr/bin/env python3
"""Fix Jim Hudson node in network-graph.json.

Corrects: 'Secretary of the Arkansas Department of Human Services (DHS)'
      to: 'Secretary of the Arkansas Department of Finance and Administration (DFA)'

Adds new observations from LOPFI/ASHERS research (March 2026).

Run from repo root:
  python fix-hudson-node.py
  git add assets/js/network-graph.json
  git commit -m "Fix Jim Hudson node: DHS -> DFA, add board memberships"

Delete this script after use:
  git rm fix-hudson-node.py
"""
import json
import sys

path = 'assets/js/network-graph.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

found = False
for node in data['nodes']:
    if node['id'] == 'Jim Hudson':
        found = True
        old_obs = node['observations']
        print(f'Found Jim Hudson node with {len(old_obs)} observations:')
        for i, obs in enumerate(old_obs):
            print(f'  [{i}] {obs[:100]}...' if len(obs) > 100 else f'  [{i}] {obs}')

        # Fix observation 0: DHS -> DFA
        node['observations'][0] = (
            'Secretary of the Arkansas Department of Finance and Administration (DFA); '
            'serves on ASHERS and APERS boards by statute'
        )

        # Add new observations
        new_obs = [
            'ASHERS BOARD MEMBER: Sits on ASHERS (Arkansas State Highway Employees Retirement System) '
            'board as statutory member by virtue of DFA Secretary role (alongside Treasurer Thurston).',
            'APERS BOARD CHAIR 2026: Became Chair of the APERS Board of Trustees for calendar year 2026, '
            'succeeding Darryl Bassett. Was previously vice chair.',
            'APRIL 15, 2025 MEETING: Met with Lawrence Berman (Israel Bonds NMD), Dennis Milligan, '
            'and Jason Brady at 3:00 PM in Auditor\u2019s Capitol Office Room 230 (AUDIT-JUN25-0002, '
            'AUDIT-JUN25-0050).',
        ]

        for obs in new_obs:
            if obs not in node['observations']:
                node['observations'].append(obs)

        node['observationCount'] = len(node['observations'])
        print(f'\nUpdated to {node["observationCount"]} observations:')
        for i, obs in enumerate(node['observations']):
            print(f'  [{i}] {obs[:100]}...' if len(obs) > 100 else f'  [{i}] {obs}')
        break

if not found:
    print('ERROR: Jim Hudson node not found in network-graph.json')
    sys.exit(1)

# Also check for the edge: Jim Hudson -> ASHERS board_member_of
# and Jim Hudson -> APERS board_chair_of
existing_edges = {(l['source'], l['target'], l['type']) for l in data['links']}

new_edges = []
if ('Jim Hudson', 'April 2025 Israel Bonds Tour', 'met_with_bonds_reps_during') not in existing_edges:
    new_edges.append({
        'source': 'Jim Hudson',
        'target': 'April 2025 Israel Bonds Tour',
        'type': 'met_with_bonds_reps_during'
    })
    # Note: Jim Hudson already has this edge from original graph build,
    # so this will only add if missing

if new_edges:
    data['links'].extend(new_edges)
    data['metadata']['totalLinks'] = len(data['links'])
    print(f'\nAdded {len(new_edges)} new edge(s). Total links: {data["metadata"]["totalLinks"]}')
else:
    print(f'\nNo new edges needed. Total links: {data["metadata"]["totalLinks"]}')

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write('\n')  # trailing newline

print(f'\nWrote {path} with UTF-8 encoding.')
