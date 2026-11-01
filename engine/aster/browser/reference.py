"""Independent small Python decoder/model; deterministic synthetic ITCH, no feed data."""
import json, struct, hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'public/aster'
BASE=9007199254740993  # deliberately beyond JavaScript's exact Number range

def message(kind, ref, shares=0, price=0, side='B', replacement=0):
    header=kind.encode()+struct.pack('>HH',1,0)+(0).to_bytes(6,'big')
    if kind=='A': body=struct.pack('>QcI8sI',ref,side.encode(),shares,b'DEMO    ',price)
    elif kind=='U': body=struct.pack('>QQII',ref,replacement,shares,price)
    elif kind=='D': body=struct.pack('>Q',ref)
    elif kind=='E': body=struct.pack('>QIQ',ref,shares,1)
    else: body=struct.pack('>QI',ref,shares)
    payload=header+body
    return struct.pack('>H',len(payload))+payload

SCENES=[
 ('A',BASE,100,1894200,'B',0,'A opens the bid with 100 shares.'),
 ('A',BASE+1,80,1894400,'S',0,'C opens the ask. The spread is two cents.'),
 ('A',BASE+2,60,1894200,'B',0,'B joins behind A at the same price.'),
 ('X',BASE,40,0,'B',0,'Cancel 40 from A. Its priority stays first.'),
 ('E',BASE,60,0,'B',0,'The feed reports 60 executed against A.'),
 ('E',BASE+2,15,0,'B',0,'Then 15 execute against B. B has 45 left.'),
 ('A',BASE+3,30,1894200,'B',0,'D joins behind B at the bid.'),
 ('U',BASE+2,45,1894200,'B',BASE+4,'Replace B at the same price. Its new reference goes behind D.'),
 ('A',BASE+5,25,1894300,'B',0,'A better bid appears at 189.43.'),
 ('X',BASE+1,20,0,'S',0,'Cancel 20 on the ask. Sixty remain.'),
 ('D',BASE+5,0,0,'B',0,'Delete the better bid. The old level becomes best again.'),
 ('E',BASE+3,30,0,'B',0,'D executes first. The replacement is now alone at the bid.')
]

def states(data):
    orders={}; queues={}; result=[]; cursor=0
    def snapshot():
        levels=[]; h=14695981039346656037
        for side in ['B','S']:
            prices=sorted((p for s,p in queues if s==side and queues[s,p]),reverse=side=='B')
            for price in prices:
                fifo=[{'id':str(ref),'shares':orders[ref][2]} for ref in queues[side,price]]
                levels.append({'side':side,'price4':price,'shares':str(sum(o['shares'] for o in fifo)),'fifo':fifo})
                for o in fifo:
                    for n in [1,ord(side),price,int(o['id']),o['shares']]:
                        for byte in n.to_bytes(8,'little'):
                            h=((h^byte)*1099511628211)&((1<<64)-1)
        return {'orders':len(orders),'hash':f'{h:016x}','levels':levels}
    result.append(snapshot())
    while cursor<len(data):
        n=int.from_bytes(data[cursor:cursor+2],'big'); payload=data[cursor+2:cursor+2+n]; cursor+=n+2
        kind=chr(payload[0]); ref=int.from_bytes(payload[11:19],'big')
        if kind=='A':
            side=chr(payload[19]); shares=int.from_bytes(payload[20:24],'big'); price=int.from_bytes(payload[32:36],'big')
            orders[ref]=(side,price,shares); queues.setdefault((side,price),[]).append(ref)
        else:
            side,price,old=orders[ref]
            if kind in ['E','X']:
                remaining=old-int.from_bytes(payload[19:23],'big')
                if remaining: orders[ref]=(side,price,remaining)
                else: del orders[ref]; queues[side,price].remove(ref)
            else:
                del orders[ref]; queues[side,price].remove(ref)
                if kind=='U':
                    new=int.from_bytes(payload[19:27],'big'); shares=int.from_bytes(payload[27:31],'big'); price=int.from_bytes(payload[31:35],'big')
                    orders[new]=(side,price,shares); queues.setdefault((side,price),[]).append(new)
        result.append(snapshot())
    return result

if __name__=='__main__':
    data=b''.join(message(*scene[:6]) for scene in SCENES)
    OUT.mkdir(exist_ok=True)
    (OUT/'fixture.bin').write_bytes(data)
    receipt={'fixture':'synthetic-queue-v1','sourceCommit':'a1d84909f9b4c146b33ba58d8e09d2718ca231aa','sha256':hashlib.sha256(data).hexdigest(),'labels':['Empty book. Move forward to receive the first message.']+[s[6] for s in SCENES],'aliases':{str(BASE+i):name for i,name in enumerate(['A','C','B','D','B′','E'])},'states':states(data)}
    (OUT/'reference.json').write_text(json.dumps(receipt,indent=2)+'\n')
    print(f'Generated {len(SCENES)} synthetic frames and {len(receipt["states"])} independent checkpoints.')
