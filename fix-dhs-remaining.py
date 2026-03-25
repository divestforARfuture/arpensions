import json

path = 'assets/js/network-graph.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

fixes = 0
for node in data['nodes']:
    for i, obs in enumerate(node['observations']):
        old = obs
        new = obs
        new = new.replace('DHS Secretary Jim Hudson', 'DFA Secretary Jim Hudson')
        new = new.replace('DHS Secretary', 'DFA Secretary')
        new = new.replace('Hudson/DHS', 'Hudson/DFA')
        new = new.replace('DHS (Jim Hudson)', 'DFA (Jim Hudson)')
        new = new.replace('MEETING 2 \u2014 DHS:', 'MEETING 2 \u2014 DFA:')
        new = new.replace('a cabinet secretary (DHS)', 'a cabinet secretary (DFA)')
        if old != new:
            node['observations'][i] = new
            fixes += 1
            print(node['id'] + ' obs[' + str(i) + ']: fixed')

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write('\n')

print('Fixed ' + str(fixes) + ' remaining DHS references.')
