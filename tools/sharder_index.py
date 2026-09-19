import json, os
SRC = os.path.join('assets','bdd','corpus_index.json')
OUT = os.path.join('assets','bdd','shards')
MAN = os.path.join('assets','bdd','shards_manifest.json')
TAILLE = 250
def main():
    idx = json.load(open(SRC, encoding='utf-8'))
    chunks = idx.get('chunks', [])
    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT):
        if f.startswith('shard_') and f.endswith('.json'):
            os.remove(os.path.join(OUT, f))
    shards = []
    for i in range(0, len(chunks), TAILLE):
        part = chunks[i:i+TAILLE]
        ns = {c['n'] for c in part}
        termes = {k: [v for v in vv if v in ns] for k, vv in idx.get('termes', {}).items()}
        termes = {k: v for k, v in termes.items() if v}
        fname = 'shard_%02d.json' % (i // TAILLE)
        json.dump({'chunks': part, 'termes': termes},
                  open(os.path.join(OUT, fname), 'w', encoding='utf-8'),
                  ensure_ascii=False, separators=(',', ':'))
        shards.append({'file': fname, 'nb_chunks': len(part), 'nb_termes': len(termes)})
    json.dump({'version': '1.0.0', 'nb_shards': len(shards),
               'total_chunks': len(chunks), 'shards': shards},
              open(MAN, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print('shards:', len(shards), '- total chunks:', len(chunks))
if __name__ == '__main__':
    main()
