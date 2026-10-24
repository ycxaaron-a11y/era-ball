import {readFileSync} from 'node:fs';
export async function createTestDatabase() {
 const {PGlite}=await import(process.env.ERA_PGLITE_MODULE || '@electric-sql/pglite');
 const db=new PGlite();
 await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;`);
 await db.exec(readFileSync(new URL('../supabase/multiplayer.sql',import.meta.url),'utf8'));
 const migration=readFileSync(new URL('../supabase/upgrade-all-v5.sql',import.meta.url),'utf8');
 await db.exec(migration);
 async function rpc(uid,name,args){
  if(!/^_?fc_[a-z0-9_]+$/.test(name))throw Error('Invalid test RPC name');
  return db.transaction(async tx=>{
   await tx.query("select set_config('request.jwt.claim.sub',$1,true)",[uid||'']);
   const out=await tx.query(`select ${name}(${args.map((_,i)=>'$'+(i+1)).join(',')}) as value`,args);
   return out.rows[0].value;
  });
 }
 return {db,rpc,migration,addUser:uid=>db.query('insert into auth.users(id) values($1) on conflict do nothing',[uid])};
}
