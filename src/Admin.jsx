import { useMemo, useState } from "react";
import { DEFAULT_CONTENT, loadContent, saveContent } from "./content";

const KEY="grandpa-memory-admin-unlocked";

function Login({onLogin}){
 const [password,setPassword]=useState(""),[error,setError]=useState("");
 function submit(e){e.preventDefault();if(password==="memory"){localStorage.setItem(KEY,"1");onLogin()}else setError("Неверный пароль")}
 return <div className="admin-login"><div className="admin-card"><span className="mini-label">НН · АРХИВ</span><h1>Панель<br/><em>администратора</em></h1><p>Локальный редактор контента. Пароль первого прототипа: <b>memory</b>.</p><form onSubmit={submit}><input autoFocus type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Пароль"/><button>Войти →</button></form>{error&&<small className="admin-error">{error}</small>}<a href="#top">← Вернуться на сайт</a></div></div>
}
function Field({label,value,onChange,area=false}){return <label className="admin-field"><span>{label}</span>{area?<textarea value={value} onChange={e=>onChange(e.target.value)}/>:<input value={value} onChange={e=>onChange(e.target.value)}/>}</label>}
export default function Admin(){
 const [unlocked,setUnlocked]=useState(localStorage.getItem(KEY)==="1"),[content,setContent]=useState(loadContent),[saved,setSaved]=useState(false),[tab,setTab]=useState("main");
 const json=useMemo(()=>JSON.stringify(content,null,2),[content]);
 if(!unlocked)return <Login onLogin={()=>setUnlocked(true)}/>;
 const update=(group,field,value)=>setContent(c=>({...c,[group]:{...c[group],[field]:value}}));
 const updateTimeline=(index,field,value)=>setContent(c=>({...c,timeline:c.timeline.map((x,i)=>i===index?{...x,[field]:value}:x)}));
 function save(){saveContent(content);setSaved(true);setTimeout(()=>setSaved(false),1800)}
 function reset(){setContent(DEFAULT_CONTENT);saveContent(DEFAULT_CONTENT)}
 function download(){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([json],{type:"application/json"}));a.download="grandpa-memory-content.json";a.click();URL.revokeObjectURL(a.href)}
 function logout(){localStorage.removeItem(KEY);location.hash="#admin";setUnlocked(false)}
 return <div className="admin-shell"><aside className="admin-side"><a className="brand" href="#top">НН<span>·</span>ПАМЯТЬ</a><div className="admin-nav"><button className={tab==="main"?"selected":""} onClick={()=>setTab("main")}>Главная</button><button className={tab==="timeline"?"selected":""} onClick={()=>setTab("timeline")}>Хронология</button><button className={tab==="data"?"selected":""} onClick={()=>setTab("data")}>Данные</button></div><div className="admin-side-bottom"><a href="#top">Открыть сайт ↗</a><button onClick={logout}>Выйти</button></div></aside>
 <main className="admin-main"><div className="admin-top"><div><span className="mini-label">УПРАВЛЕНИЕ САЙТОМ</span><h1>Панель управления</h1></div><button className="admin-save" onClick={save}>{saved?"Сохранено ✓":"Сохранить изменения"}</button></div>
 {tab==="main"&&<><section className="admin-section"><h2>Первый экран</h2><Field label="Надпись" value={content.hero.eyebrow} onChange={v=>update("hero","eyebrow",v)}/><Field label="Имя" value={content.hero.title} onChange={v=>update("hero","title",v)}/><Field label="Фамилия / акцент" value={content.hero.titleAccent} onChange={v=>update("hero","titleAccent",v)}/><Field label="Описание" value={content.hero.lead} onChange={v=>update("hero","lead",v)} area/></section>
 <section className="admin-section"><h2>О человеке</h2><Field label="Главный текст" value={content.life.lead} onChange={v=>update("life","lead",v)} area/><Field label="Абзац 1" value={content.life.text1} onChange={v=>update("life","text1",v)} area/><Field label="Абзац 2" value={content.life.text2} onChange={v=>update("life","text2",v)} area/></section>
 <section className="admin-section"><h2>Цитата</h2><Field label="Текст" value={content.quote} onChange={v=>setContent(c=>({...c,quote:v}))} area/></section>
 <section className="admin-section"><h2>Подвал</h2><Field label="Текст" value={content.footer} onChange={v=>setContent(c=>({...c,footer:v}))}/></section></>}
 {tab==="timeline"&&<section className="admin-section"><h2>Хронология</h2>{content.timeline.map((item,i)=><div className="admin-timeline" key={i}><div className="admin-timeline-head"><span>{String(i+1).padStart(2,"0")}</span><b>{item.year}</b></div><Field label="Год" value={item.year} onChange={v=>updateTimeline(i,"year",v)}/><Field label="Заголовок" value={item.title} onChange={v=>updateTimeline(i,"title",v)}/><Field label="Описание" value={item.text} onChange={v=>updateTimeline(i,"text",v)} area/></div>)}</section>}
 {tab==="data"&&<section className="admin-section"><h2>Резервная копия</h2><p className="admin-note">Сейчас редактор хранит изменения в localStorage этого браузера. Это удобно для прототипа, но не является серверной админкой. Перед публикацией подключим настоящую авторизацию и базу данных.</p><textarea className="json-box" readOnly value={json}/><div className="admin-actions"><button onClick={download}>Скачать JSON</button><button onClick={reset}>Сбросить изменения</button></div></section>}
 </main></div>
}