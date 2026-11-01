const {createClient}=supabase;
const cfg=window.WAYGO_CONFIG||{};
const ready=cfg.SUPABASE_URL&&!cfg.SUPABASE_URL.includes("YOUR_")&&cfg.SUPABASE_ANON_KEY&&!cfg.SUPABASE_ANON_KEY.includes("YOUR_");
const db=ready?createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null;
let user=null, profile=null;
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function msg(t,bad=false){let el=$('#message');if(el){el.textContent=t;el.className='notice '+(bad?'error':'');el.classList.remove('hidden')}}
function needDb(){if(!db){msg('Najprv nastav SUPABASE_URL a SUPABASE_ANON_KEY v config.js.',true);return false}return true}
async function init(){if(!needDb())return;const {data:{session}}=await db.auth.getSession();user=session?.user||null;if(user){await loadProfile();if(!profile?.first_name){location.href='account.html?setup=1';return}}renderPage();db.auth.onAuthStateChange((_e,s)=>{user=s?.user||null;if(!user&&!['login.html','signup.html','index.html'].includes(location.pathname.split('/').pop()))location.href='login.html'})}
async function loadProfile(){let {data}=await db.from('profiles').select('*').eq('id',user.id).maybeSingle();profile=data}

function nav(active) {
    return `
        <nav class="bottom">
            <a class="navitem ${active === 'social' ? 'active' : ''}"
               href="social.html" aria-label="Skupiny">
                <b>♧</b>
            </a>

            <a class="navitem ${active === 'home' ? 'active' : ''}"
               href="home.html" aria-label="Domov">
                <b>⌂</b>
            </a>

            <a class="navitem ${active === 'account' ? 'active' : ''}"
               href="account.html" aria-label="Účet">
                <b>♙</b>
            </a>
        </nav>
    `;
}
function shell(content,active){$('#app').innerHTML=`<main class="wrap"><header class="top"><a class="brand" href="home.html">WG <span>WayGo</span></a><button class="btn secondary" id="logout">Odhlásiť</button></header>${content}</main>${nav(active)}`;$('#logout')?.addEventListener('click',async()=>{await db.auth.signOut();location.href='login.html'})}
function page(){return location.pathname.split('/').pop()||'index.html'}
function renderPage(){const p=page();if(p==='home.html')home();else if(p==='account.html')account();else if(p==='notes.html')notes();else if(p==='calendar.html')calendar();else if(p==='stats.html')stats();else if(p==='social.html')social();else if(p==='admin.html')admin();else if(p==='successful.html')success();else home()}

async function authPage(mode) {
    if (!needDb()) return;

    const signup = mode === 'signup';

    $('#app').innerHTML = `
        <section class="auth card">

            <!-- LOGO -->
            <div class="center brand">
                WG <span>WayGo</span>
            </div>

            <!-- NADPIS -->
            <h1 class="center">
                ${signup ? 'Vytvor si účet ✨' : 'Vitaj späť 👋'}
            </h1>

            <p class="muted center">
                ${signup
                    ? 'Začni svoju WayGo cestu.'
                    : 'Tvoja ďalšia cesta začína práve tu.'}
            </p>

            <!-- SPRÁVY -->
            <div id="message" class="notice hidden"></div>

            <!-- REGISTRÁCIA -->
            ${signup ? `
                <label class="label">Krstné meno</label>
                <input
                    id="first"
                    class="field"
                    placeholder="Ako ťa máme volať?"
                    autocomplete="given-name"
                >
            ` : ''}

            <!-- EMAIL -->
            <label class="label">E-mail</label>
            <input
                id="email"
                class="field"
                type="email"
                placeholder="tvoj@email.com"
                autocomplete="email"
            >

            <!-- HESLO -->
            <label class="label">Heslo</label>
            <input
                id="password"
                class="field"
                type="password"
                placeholder="Zadaj svoje heslo"
                autocomplete="${signup ? 'new-password' : 'current-password'}"
            >

            <!-- HLAVNÉ TLAČIDLO -->
            <button id="submit" class="btn">
                ${signup ? 'Vytvoriť účet ✨' : 'Prihlásiť sa →'}
            </button>

            ${!signup ? `
                <p class="small center">
                    <a href="#" id="forgot">Zabudnuté heslo?</a>
                </p>
            ` : ''}

            <!-- ODDEĽOVAČ -->
            <div class="login-divider">
                ALEBO POKRAČUJ POMOCOU
            </div>

            <!-- GOOGLE A APPLE -->
            <div class="social-login">

                <button
                    type="button"
                    id="google"
                    class="social-btn"
                    aria-label="Pokračovať cez Google"
                    title="Google"
                >
                    <svg viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        />
                        <path fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 38.05 46.98 31.9 46.98 24.55z"
                        />
                        <path fill="#FBBC05"
                            d="M10.53 28.59A14.5 14.5 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.93 23.93 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"
                        />
                        <path fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />
                    </svg>
                </button>

                <button
                    type="button"
                    id="apple"
                    class="social-btn"
                    aria-label="Pokračovať cez Apple"
                    title="Apple"
                >
                    <svg viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true">
                        <path d="M16.37 12.57c.02 2.07 1.82 2.76 1.84 2.77-.02.05-.29 1.01-.95 2-.57.85-1.16 1.69-2.1 1.71-.92.02-1.22-.55-2.28-.55-1.06 0-1.4.53-2.27.57-.91.03-1.61-.92-2.18-1.77-1.17-1.7-2.06-4.8-.86-6.9.6-1.04 1.67-1.7 2.83-1.72.88-.02 1.71.6 2.25.6.54 0 1.55-.74 2.62-.63.45.02 1.7.18 2.5 1.34-.06.04-1.49.87-1.48 2.58ZM14.65 6.89c.48-.58.8-1.38.71-2.18-.69.03-1.53.46-2.03 1.04-.45.52-.84 1.33-.73 2.11.77.06 1.56-.39 2.05-.97Z"/>
                    </svg>
                </button>

            </div>

            <!-- REGISTRÁCIA / PRIHLÁSENIE -->
            <p class="signup-link center">
                ${signup
                    ? 'Už máš účet? <a href="login.html">Prihlás sa</a>'
                    : 'Nemáš ešte účet? <a href="signup.html">Zaregistruj sa ✨</a>'
                }
            </p>

        </section>
    `;

    // EMAIL A HESLO
    $('#submit').onclick = async () => {
        const email = $('#email').value.trim();
        const password = $('#password').value;
        const first = $('#first')?.value.trim() || '';

        if (!email || !password || (signup && !first)) {
            return msg('Vyplň všetky povinné polia.', true);
        }

        const button = $('#submit');
        button.disabled = true;
        button.textContent = 'Načítavam...';

        try {
            const r = signup
                ? await db.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { first_name: first }
                    }
                })
                : await db.auth.signInWithPassword({
                    email,
                    password
                });

            if (r.error) {
                msg(r.error.message, true);
                return;
            }

            if (signup && !r.data.session) {
                msg(
                    'Skontroluj e-mail a potvrď registráciu.'
                );
                return;
            }

            location.href = 'successful.html';

        } catch (error) {
            msg(error.message || 'Nastala chyba.', true);
        } finally {
            button.disabled = false;
            button.textContent = signup
                ? 'Vytvoriť účet ✨'
                : 'Prihlásiť sa →';
        }
    };

    // GOOGLE A APPLE OAUTH
    for (const [id, provider] of [
        ['google', 'google'],
        ['apple', 'apple']
    ]) {
        $('#' + id).onclick = async () => {
            const { error } = await db.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: location.origin + '/successful.html'
                }
            });

            if (error) {
                msg(error.message, true);
            }
        };
    }

    // ZABUDNUTÉ HESLO
    $('#forgot')?.addEventListener('click', async e => {
        e.preventDefault();

        const email = $('#email').value.trim();

        if (!email) {
            return msg('Najprv zadaj svoj e-mail.', true);
        }

        const { error } = await db.auth.resetPasswordForEmail(
            email,
            {
                redirectTo: location.origin + '/reset.html'
            }
        );

        msg(
            error
                ? error.message
                : 'Ak účet existuje, poslali sme odkaz na obnovu hesla. Skontroluj e-mail.',
            !!error
        );
    });
}

async function success(){if(!needDb())return;let {data:{session}}=await db.auth.getSession();if(!session){location.href='login.html';return}user=session.user;await loadProfile();$('#app').innerHTML='<section class="auth card center"><div class="brand">WG <span>WayGo</span></div><h1 class="success">Úspešne prihlásený/á!</h1><p class="muted">Tvoj účet je pripravený.</p><button class="btn" id="go">Pokračovať</button></section>';$('#go').onclick=()=>location.href=profile?.first_name?'home.html':'account.html?setup=1'}

async function home() {

    const materials = [
        {
            category: 'lf',
            subject: 'Biológia',
            title: 'Bunková biológia',
            description: 'Základná stavebná a funkčná jednotka živých organizmov.',
            content: `
                <h3>Čo je bunka?</h3>
                <p>Bunka je základná stavebná a funkčná jednotka všetkých živých organizmov.</p>

                <h3>Základné organely</h3>
                <ul>
                    <li><b>Jadro</b> – obsahuje genetickú informáciu.</li>
                    <li><b>Mitochondrie</b> – zabezpečujú tvorbu energie.</li>
                    <li><b>Ribozómy</b> – syntéza bielkovín.</li>
                </ul>
            `
        },
        {
            category: 'lf',
            subject: 'Chémia',
            title: 'Organická chémia',
            description: 'Úvod do organických zlúčenín a ich vlastností.',
            content: `
                <h3>Čo skúma organická chémia?</h3>
                <p>Organická chémia sa zaoberá zlúčeninami uhlíka, ich štruktúrou, vlastnosťami a reakciami.</p>
                <h3>Základné pojmy</h3>
                <ul>
                    <li>Uhlíkový reťazec</li>
                    <li>Funkčné skupiny</li>
                    <li>Izoméria</li>
                </ul>
            `
        },
        {
            category: 'maturita',
            subject: 'Slovenčina',
            title: 'Literárne druhy',
            description: 'Prehľad základných literárnych druhov.',
            content: `
                <h3>Základné literárne druhy</h3>
                <ul>
                    <li>Epika</li>
                    <li>Lyrika</li>
                    <li>Dráma</li>
                </ul>
            `
        }
    ];

    let active = 'mix';

    shell(`
        <div class="home-feed">

            <header class="feed-header">
                <div class="brand">WG <span>WayGo</span></div>
                <h1>Pre teba</h1>
                <p class="muted">Objavuj, čítaj a uč sa.</p>
            </header>

            <div class="feed-filters">
                <button class="pill active" data-filter="mix">Všetko</button>
                <button class="pill" data-filter="lf">LF UK</button>
                <button class="pill" data-filter="maturita">Maturita</button>
            </div>

            <div class="feed-heading">
                <h2>Najnovšie materiály</h2>
            </div>

            <div id="study-feed"></div>

        </div>
    `, 'home');

    function renderFeed() {

        const filtered = active === 'mix'
            ? materials
            : materials.filter(item => item.category === active);

        $('#study-feed').innerHTML = filtered.length
            ? filtered.map(item => `
                <article class="card study-post">

                    <div class="post-category">
                        ${item.category === 'lf' ? 'LF UK' : 'MATURITA'}
                        · ${esc(item.subject.toUpperCase())}
                    </div>

                    <h2>${esc(item.title)}</h2>

                    <p class="muted">${esc(item.description)}</p>

                    <div class="study-content">
                        ${item.content}
                    </div>

                    <div class="post-footer">
                        <span>📚 Študijný materiál</span>
                        <span>WayGo</span>
                    </div>

                </article>
            `).join('')
            : '<div class="card muted">Zatiaľ tu nie sú žiadne materiály.</div>';
    }

    document.querySelectorAll('[data-filter]').forEach(button => {
        button.addEventListener('click', () => {

            active = button.dataset.filter;

            document.querySelectorAll('[data-filter]').forEach(b => {
                b.classList.toggle(
                    'active',
                    b.dataset.filter === active
                );
            });

            renderFeed();
        });
    });

    renderFeed();
}
async function account(){let setup=new URLSearchParams(location.search).has('setup');shell(`<div class="center"><h1>Môj účet</h1><img id="avatar" class="avatar" src="${esc(profile?.avatar_url||'')}" onerror="this.style.opacity=.2"><h2>${esc(profile?.first_name||'')}</h2>${profile?.is_vip?'<span class="pill active">✦ VIP</span>':''}</div>${setup?'<div class="card"><h2>Dokonči profil</h2><label class="label">Krstné meno</label><input id="first" class="field" placeholder="Krstné meno"><label class="label">Profilová fotka</label><input id="photo" class="field" type="file" accept="image/*"><button id="saveprofile" class="btn">Uložiť profil</button></div>':''}<div class="grid"><a class="card" href="notes.html"><h2>▤ Poznámky</h2><p class="muted">Tvoje študijné zápisky</p></a><a class="card" href="calendar.html"><h2>▦ Kalendár</h2><p class="muted">Plán učenia a termíny</p></a><a class="card" href="stats.html"><h2>↗ Štatistiky</h2><p class="muted">Prehľad učenia</p></a></div><div class="card"><h2>Najlepší študenti mesiaca</h2><div id="monthly" class="muted">Načítavam…</div></div><div class="card"><h2>Najlepší študenti roka</h2><div id="yearly" class="muted">Načítavam…</div></div>${profile?.is_vip?'':'<p class="small muted">Bezplatný účet: limit 20 študijných záznamov mesačne. VIP účet má neobmedzené zaznamenávanie učenia.</p>'}${profile?.is_vip||false?'':'<a class="small" href="admin.html">Administrácia</a>'}`, 'account');if(setup){$('#first').value=profile?.first_name||'';$('#saveprofile').onclick=async()=>{let first=$('#first').value.trim(),file=$('#photo').files[0];if(!first)return msg('Zadaj krstné meno.',true);let avatar_url=profile?.avatar_url;if(file){let path=`${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g,'_')}`;let up=await db.storage.from('avatars').upload(path,file,{upsert:true});if(up.error)return msg(up.error.message,true);avatar_url=db.storage.from('avatars').getPublicUrl(path).data.publicUrl}let {error}=await db.from('profiles').upsert({id:user.id,first_name:first,avatar_url,is_vip:profile?.is_vip||false});if(error)return msg(error.message,true);await loadProfile();location.href='account.html'}};await leaderboard('monthly');await leaderboard('yearly');async function leaderboard(id){let start=new Date();if(id==='monthly')start.setDate(1);else start=new Date(start.getFullYear(),0,1);let {data}=await db.from('learning_sessions').select('user_id,minutes').gte('learned_on',start.toISOString().slice(0,10));let totals={};(data||[]).forEach(x=>totals[x.user_id]=(totals[x.user_id]||0)+x.minutes);let sorted=Object.entries(totals).sort((a,b)=>b[1]-a[1]).slice(0,5);let ids=sorted.map(x=>x[0]);let names={};if(ids.length){let {data:ps}=await db.from('profiles').select('id,first_name').in('id',ids);(ps||[]).forEach(p=>names[p.id]=p.first_name)}$('#'+id).innerHTML=sorted.length?sorted.map(([uid,m],i)=>`${i+1}. ${esc(names[uid]||'Študent')} — ${Math.round(m/60*10)/10} h`).join('<br>'):'Zatiaľ bez údajov.'}}
async function notes(){shell(`<h1>Poznámky</h1><p class="muted">Vytváraj a upravuj vlastné poznámky.</p><div class="card"><input id="ntitle" class="field" placeholder="Názov poznámky"><textarea id="nbody" class="field" rows="5" placeholder="Napíš si poznámku…"></textarea><button id="addnote" class="btn">Uložiť poznámku</button></div><div id="noteslist"></div>`,'account');$('#addnote').onclick=async()=>{let title=$('#ntitle').value.trim(),body=$('#nbody').value.trim();if(!title)return msg('Zadaj názov poznámky.',true);let {error}=await db.from('notes').insert({user_id:user.id,title,body});if(error)return msg(error.message,true);$('#ntitle').value='';$('#nbody').value='';load()};load();async function load(){let {data,error}=await db.from('notes').select('*').eq('user_id',user.id).order('updated_at',{ascending:false});$('#noteslist').innerHTML=error?'Nepodarilo sa načítať poznámky.':(data||[]).map(n=>`<div class="card"><input class="field title" value="${esc(n.title)}"><textarea class="field body" rows="4">${esc(n.body)}</textarea><div class="row"><button class="btn save" data-id="${n.id}">Uložiť zmeny</button><button class="btn danger del" data-id="${n.id}">Vymazať</button></div></div>`).join('')||'<p class="muted">Zatiaľ nemáš poznámky.</p>';$('#noteslist').querySelectorAll('.save').forEach(b=>b.onclick=async()=>{let c=b.closest('.card');let {error}=await db.from('notes').update({title:c.querySelector('.title').value,body:c.querySelector('.body').value,updated_at:new Date().toISOString()}).eq('id',b.dataset.id);msg(error?.message||'Poznámka uložená.',!!error)});$('#noteslist').querySelectorAll('.del').forEach(b=>b.onclick=async()=>{if(confirm('Naozaj vymazať poznámku?')){await db.from('notes').delete().eq('id',b.dataset.id);load()}})}}
async function calendar(){shell(`<h1>Kalendár</h1><p class="muted">Plánuj testy, učenie a dôležité termíny.</p><div class="card"><input id="etitle" class="field" placeholder="Názov udalosti"><textarea id="edetails" class="field" rows="2" placeholder="Podrobnosti"></textarea><label class="label">Dátum a čas</label><input id="edate" class="field" type="datetime-local"><button id="addevent" class="btn">Pridať do kalendára</button></div><div id="events"></div>`,'account');$('#edate').value=new Date(Date.now()+3600000).toISOString().slice(0,16);$('#addevent').onclick=async()=>{let title=$('#etitle').value.trim(),starts_at=new Date($('#edate').value).toISOString();if(!title)return msg('Zadaj názov udalosti.',true);let {error}=await db.from('calendar_events').insert({user_id:user.id,title,details:$('#edetails').value,starts_at});if(error)return msg(error.message,true);$('#etitle').value='';load()};load();async function load(){let {data,error}=await db.from('calendar_events').select('*').eq('user_id',user.id).order('starts_at');$('#events').innerHTML=error?'Nepodarilo sa načítať udalosti.':(data||[]).map(e=>`<div class="card row" style="justify-content:space-between"><div><h3>${esc(e.title)}</h3><p class="muted small">${new Date(e.starts_at).toLocaleString('sk-SK')} · ${esc(e.details)}</p></div><button class="btn danger del" data-id="${e.id}">Zmazať</button></div>`).join('')||'<p class="muted">Kalendár je zatiaľ prázdny.</p>';$('#events').querySelectorAll('.del').forEach(b=>b.onclick=async()=>{await db.from('calendar_events').delete().eq('id',b.dataset.id);load()})}}
async function stats(){shell(`<h1>Štatistiky učenia</h1><p class="muted">Zaznamenaj si čas učenia a sleduj svoj progres.</p><div class="card"><input id="subject" class="field" placeholder="Predmet"><label class="label">Počet minút</label><input id="minutes" class="field" type="number" min="1" max="1440" value="30"><button id="log" class="btn">Zaznamenať učenie</button><p class="small muted">${profile?.is_vip?'VIP: bez mesačného limitu.':'Free: najviac 20 záznamov za mesiac.'}</p></div><div class="grid"><div class="card"><div class="muted">Tento mesiac</div><div class="stat" id="monthtotal">—</div><div class="small muted">hodín učenia</div></div><div class="card"><div class="muted">Tento rok</div><div class="stat" id="yeartotal">—</div><div class="small muted">hodín učenia</div></div></div><div class="card"><h2>Posledné záznamy</h2><div id="history"></div></div>`,'account');$('#log').onclick=async()=>{let subject=$('#subject').value.trim(),minutes=Number($('#minutes').value);if(!subject||!Number.isInteger(minutes)||minutes<1||minutes>1440)return msg('Vyplň predmet a platný čas (1–1440 minút).',true);let {error}=await db.from('learning_sessions').insert({user_id:user.id,subject,minutes});if(error)return msg(error.message.includes('row-level security')?'Dosiahol/a si mesačný limit bezplatného účtu. VIP má neobmedzený limit.':error.message,true);$('#subject').value='';load()};load();async function load(){let now=new Date(),month=new Date(now.getFullYear(),now.getMonth(),1).toISOString().slice(0,10),year=new Date(now.getFullYear(),0,1).toISOString().slice(0,10);let {data,error}=await db.from('learning_sessions').select('*').eq('user_id',user.id).order('learned_on',{ascending:false}).limit(100);if(error)return msg(error.message,true);let rows=data||[],sum=a=>a.reduce((n,x)=>n+x.minutes,0);$('#monthtotal').textContent=(sum(rows.filter(x=>x.learned_on>=month))/60).toFixed(1);$('#yeartotal').textContent=(sum(rows.filter(x=>x.learned_on>=year))/60).toFixed(1);$('#history').innerHTML=rows.slice(0,30).map(x=>`<div class="row" style="justify-content:space-between;border-bottom:1px solid var(--line);padding:9px 0"><span>${esc(x.subject)} <span class="muted small">${x.learned_on}</span></span><b>${x.minutes} min</b></div>`).join('')||'<span class="muted">Zatiaľ nemáš žiadne záznamy.</span>'}}
async function social(){shell(`<h1>Skupiny</h1><p class="muted">Nájdi spolužiakov a učte sa spoločne.</p><div class="card"><h2>Vytvoriť skupinu</h2><input id="gname" class="field" placeholder="Názov skupiny"><textarea id="gdesc" class="field" placeholder="O čom skupina je?"></textarea><button id="createg" class="btn">Vytvoriť</button></div><div id="groups"></div><div class="card"><h2>Nový príspevok</h2><input id="ptitle" class="field" placeholder="Názov / predmet"><select id="pcat" class="field"><option value="mix">Mix</option><option value="lf">LF UK</option><option value="maturita">Maturita</option></select><textarea id="pbody" class="field" rows="4" placeholder="Čo chceš zdieľať?"></textarea><button id="createp" class="btn">Zverejniť</button></div><h2>Diskusia</h2><div id="posts"></div>`,'social');$('#createg').onclick=async()=>{let name=$('#gname').value.trim();if(!name)return msg('Zadaj názov skupiny.',true);let {data,error}=await db.from('study_groups').insert({owner_id:user.id,name,description:$('#gdesc').value}).select().single();if(error)return msg(error.message,true);await db.from('group_members').insert({group_id:data.id,user_id:user.id,role:'owner'});loadGroups()};$('#createp').onclick=async()=>{let title=$('#ptitle').value.trim(),body=$('#pbody').value.trim();if(!title||!body)return msg('Vyplň názov aj text príspevku.',true);let {error}=await db.from('posts').insert({author_id:user.id,title,body,category:$('#pcat').value});if(error)return msg(error.message,true);$('#ptitle').value='';$('#pbody').value='';loadPosts()};loadGroups();loadPosts();async function loadGroups(){let {data}=await db.from('study_groups').select('*,group_members(count)').order('created_at',{ascending:false});$('#groups').innerHTML=(data||[]).map(g=>`<div class="card row" style="justify-content:space-between"><div><h3>${esc(g.name)}</h3><p class="small muted">${esc(g.description)} · ${g.group_members?.[0]?.count||0} členov</p></div><button class="btn secondary join" data-id="${g.id}">Členstvo</button></div>`).join('')||'<p class="muted">Zatiaľ neexistujú skupiny.</p>';$('#groups').querySelectorAll('.join').forEach(b=>b.onclick=async()=>{let id=b.dataset.id,{data:m}=await db.from('group_members').select('*').eq('group_id',id).eq('user_id',user.id).maybeSingle();if(m)await db.from('group_members').delete().eq('group_id',id).eq('user_id',user.id);else{let {error}=await db.from('group_members').insert({group_id:id,user_id:user.id});if(error)return msg(error.message,true)}loadGroups()})}async function loadPosts(){let {data}=await db.from('posts').select('*,profiles(first_name),comments(*) ,post_likes(count)').order('created_at',{ascending:false}).limit(25);$('#posts').innerHTML=(data||[]).map(p=>`<article class="card"><div class="small muted">${esc(p.profiles?.first_name||'Študent')} · ${new Date(p.created_at).toLocaleString('sk-SK')}</div><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p><div class="row"><button class="pill like" data-id="${p.id}">♡ Páči sa mi (${p.post_likes?.[0]?.count||0})</button><button class="pill showcomments" data-id="${p.id}">Komentáre (${p.comments?.length||0})</button>${p.author_id===user.id||profile?.is_admin?`<button class="pill deletepost" data-id="${p.id}">Zmazať</button>`:''}</div><div class="comments hidden" id="c-${p.id}">${(p.comments||[]).map(c=>`<p class="small">${esc(c.body)}</p>`).join('')}<input class="field commentinput" placeholder="Napíš komentár"><button class="btn secondary addcomment" data-id="${p.id}">Odoslať</button></div></article>`).join('')||'<p class="muted">Zatiaľ bez príspevkov.</p>';$('#posts').querySelectorAll('.like').forEach(b=>b.onclick=async()=>{let {data:l}=await db.from('post_likes').select('*').eq('post_id',b.dataset.id).eq('user_id',user.id).maybeSingle();if(l)await db.from('post_likes').delete().eq('post_id',b.dataset.id).eq('user_id',user.id);else await db.from('post_likes').insert({post_id:b.dataset.id,user_id:user.id});loadPosts()});$('#posts').querySelectorAll('.showcomments').forEach(b=>b.onclick=()=>$('#c-'+b.dataset.id).classList.toggle('hidden'));$('#posts').querySelectorAll('.addcomment').forEach(b=>b.onclick=async()=>{let input=b.parentElement.querySelector('input'),body=input.value.trim();if(!body)return;let {error}=await db.from('comments').insert({post_id:b.dataset.id,author_id:user.id,body});if(error)return msg(error.message,true);loadPosts()});$('#posts').querySelectorAll('.deletepost').forEach(b=>b.onclick=async()=>{if(confirm('Zmazať príspevok?')){await db.from('posts').delete().eq('id',b.dataset.id);loadPosts()}})}}
async function admin(){if(!user){location.href='login.html';return}let {data:{user:au}}=await db.auth.getUser();if(au.app_metadata?.role!=='admin'){shell('<div class="card"><h1>Prístup zamietnutý</h1><p class="muted">Táto stránka je dostupná iba administrátorovi WayGo.</p></div>','account');return}shell(`<h1>Administrácia</h1><p class="muted">Správa VIP členstva. Zmeny overuje databáza.</p><div class="card"><input id="target" class="field" placeholder="UUID používateľa"><div class="row"><button id="vipon" class="btn">Prideliť VIP</button><button id="vipoff" class="btn secondary">Odobrať VIP</button></div><p class="small muted">UUID nájdeš v Supabase → Authentication → Users.</p></div>`,'account');async function set(v){let id=$('#target').value.trim();if(!id)return msg('Zadaj UUID používateľa.',true);let {error}=await db.rpc('admin_set_vip',{target_user:id,vip_value:v});msg(error?.message||`VIP ${v?'pridelené':'odobraté'}.`,!!error)}$('#vipon').onclick=()=>set(true);$('#vipoff').onclick=()=>set(false)}
if(page()==='login.html')authPage('login');else if(page()==='signup.html')authPage('signup');else if(page()==='successful.html')success();else init();
