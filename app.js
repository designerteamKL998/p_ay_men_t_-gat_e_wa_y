const methods = {
  online:{label:'Online Transfer', channels:['vaderpay','help2pay','payessence']},
  qr:{label:'DuitNow QR', channels:['vaderpayc1','vaderpayc2','eziepayqr']},
  bank:{label:'Bank In Transfer', channels:['banktransfer']},
  wallet:{label:'E-Wallet', channels:['vaderpayc1','a9wallet','payessence','payjom','bigpayz','eziepay']},
  crypto:{label:'Crypto', channels:['usdt']}
};
const channels = {
  vaderpay:{name:'VADERPAY',mark:'VP',logo:'assets/vaderpay.png',type:'E-Wallet',time:'Instant',min:30,max:10000,featured:true,fee:'Free'},
  vaderpayc1:{name:'VADERPAY (C1)',mark:'VP',logo:'assets/vaderpay.png',type:'DuitNow QR',time:'Instant',min:30,max:10000,fee:'Free'},
  vaderpayc2:{name:'VADERPAY (C2)',mark:'VP',logo:'assets/vaderpay.png',type:'DuitNow QR',time:'Instant',min:10,max:10000,fee:'Free'},
  payessence:{name:'Pay Essence',mark:'PE',logo:'assets/payEssence.svg',type:'Online Transfer',time:'Instant–5 mins',min:10,max:30000,featured:true,fee:'Free'},
  help2pay:{name:'Help2Pay',mark:'H2',logo:'assets/helppay2.svg',type:'Online Transfer',time:'Under maintenance',min:10,max:10000,disabled:true,fee:'Free'},
  a9wallet:{name:'A9Wallet',mark:'A9',logo:'assets/a9-03.svg',type:'E-Wallet',time:'Instant',min:20,max:10000,featured:true,fee:'Free'},
  touchngo:{name:'Touch ’n Go',mark:'TNG',logo:'assets/touchngo.png',type:'E-Wallet',time:'Instant',min:20,max:10000,featured:true,fee:'Free'},
  payjom:{name:'PayJom',mark:'payjom',logo:'assets/payjom.svg',type:'E-Wallet',time:'Instant',min:20,max:15000,fee:'Free'},
  bigpayz:{name:'BigPayz',mark:'bigpayz',logo:'assets/bigpayz.svg',type:'E-Wallet',time:'1–5 mins',min:20,max:10000,fee:'Free'},
  eziepay:{name:'EeziePay',mark:'EZ',logo:'assets/eeziepay.svg',type:'E-Wallet',time:'Instant',min:40,max:500,fee:'Free'},
  eziepayqr:{name:'EeziePay',mark:'EZ',logo:'assets/eeziepay.svg',type:'DuitNow QR',time:'Instant',min:40,max:500,fee:'Free'},
  banktransfer:{name:'Local Bank Transfer',mark:'BT',type:'Bank Transfer',time:'Review in 5–15 mins',min:20,max:30000,fee:'Free'},
  usdt:{name:'VaderPay (C2)',mark:'VP',logo:'assets/vaderpay.png',type:'Crypto',time:'After on-chain confirmation',min:5,max:50000,fee:'Network fee'}
};
const onlineBankOptions = ['Affin Bank','AmBank','Bank Simpanan Nasional','Hong Leong Bank','Maybank','Public Bank Berhad','RHB Bank','CIMB Bank','Bank Islam','Bank Rakyat','Alliance Bank','OCBC Bank','UOB Bank'];
const bankTransferOptions = ['Maybank','Alliance'];
const bankAccount = { name:'JH AUTO MOBILE', number:'560102718204' };
let state={method:'online',channel:'vaderpay',filter:'all',amount:'',bank:'',cryptoNetwork:'TRC20-USDT',walletPayment:'duitNow'};
const $=s=>document.querySelector(s);
function money(n){return `MYR ${Number(n).toLocaleString('en-MY')}`}
function render(){renderTabs();renderChannels();renderSummary();renderForm()}
function renderTabs(){const methodIcons={online:'assets/onlinetransfer.svg',qr:'assets/duitNow.svg',bank:'assets/bankIn.svg',wallet:'assets/touchNgo.svg',crypto:'assets/tether.svg'};$('#categoryTabs').innerHTML=Object.entries(methods).map(([id,m])=>`<button class="category-tab ${state.method===id?'active':''}" onclick="setMethod('${id}')"><img src="${methodIcons[id]}" class="category-tab-icon" alt=""><span>${m.label}</span></button>`).join('')}
function renderChannels(){
document.querySelectorAll('#onlineBankSelection,.bank-selection,.accepts-payment,#cryptoNetworkSelection').forEach(el=>el.remove());
if(state.method==='bank'){
$('#channelTitle').textContent='Choose a receiving bank';
$('#channelSubtitle').textContent='Select the bank account you will transfer funds to.';
$('#filterBtn').classList.add('hidden');$('#filterRow').classList.add('hidden');
$('#channelGrid').innerHTML=`<div class="bank-selector"><label class="form-label bank-label">Bank options <span class="required">*</span></label><div class="bank-option-tabs">${bankTransferOptions.map(bank=>`<button class="bank-tile ${state.bank===bank?'selected':''}" onclick="chooseBank('${bank}')"><img src="assets/${bank==='Maybank'?'maybank':'alliance'}.svg" alt="${bank}"><span>${bank}</span></button>`).join('')}</div><p class="bank-helper">Select the bank you will use for this transfer.</p>${bankAccountDetails()}</div>`;
return;
}
$('#channelTitle').textContent='Choose a payment channel';
$('#channelSubtitle').textContent='Available channels update with your selected deposit method.';
$('#filterBtn').classList.add('hidden');$('#filterRow').classList.add('hidden');
const list=methods[state.method].channels.filter(id=>{let c=channels[id];return !c.disabled&&(state.filter==='all'||state.filter==='low'&&c.min<=20||state.filter==='high'&&c.max>=10000)});
$('#channelGrid').innerHTML=list.map(id=>{let c=channels[id],logo=c.logo?`<img src="${c.logo}" alt="${c.name} logo">`:c.mark;return `<button class="channel-card ${state.channel===id?'selected':''}" onclick="selectChannel('${id}')"><span class="check">✓</span><span class="channel-logo ${c.logo?'image-logo':''}">${logo}</span><div class="channel-name">${c.name}</div><div class="channel-meta"><span>${c.time}</span><span>${money(c.min)}+</span></div></button>`}).join('');
if(state.method==='crypto'){
const networkSection=`<div id="cryptoNetworkSelection" style="grid-column:1 / -1;width:100%;max-width:100%;margin-top:42px;padding-top:34px;border-top:1px solid #e3e8ef;box-sizing:border-box;overflow:hidden"><div style="font-size:18px;font-weight:600;color:#10243f;margin-bottom:20px">Choose a crypto network</div><div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;width:100%;max-width:100%;box-sizing:border-box">${[['TRC20-USDT','tether.svg','Lower network fee'],['ERC20-USDT','ethereum.svg','Ethereum network']].map(([network,icon,desc])=>`<button type="button" onclick="setCryptoNetwork('${network}')" style="position:relative;min-width:0;width:100%;min-height:150px;padding:24px 22px;border:1px solid ${state.cryptoNetwork===network?'#1677ff':'#d9e2ee'};border-radius:14px;background:${state.cryptoNetwork===network?'#eef6ff':'#fff'};cursor:pointer;text-align:left;display:flex;align-items:center;gap:18px;box-sizing:border-box;box-shadow:${state.cryptoNetwork===network?'0 0 0 1px #1677ff inset':'none'}"><span style="width:58px;height:58px;min-width:58px;border-radius:10px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#f4f6f8"><img src="assets/${icon}" alt="${network}" style="width:58px;height:58px;object-fit:contain"></span><span style="display:flex;flex-direction:column;gap:6px;min-width:0;flex:1;overflow:hidden"><b style="font-size:11px;color:#10243f;white-space:nowrap">${network}</b><small style="font-size:13px;color:#627795;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%">${desc}</small></span>${state.cryptoNetwork===network?'<span style="position:absolute;right:12px;top:12px;width:22px;height:22px;border-radius:50%;background:#2879e8;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700">✓</span>':''}</button>`).join('')}</div></div>`;
$('#channelGrid').insertAdjacentHTML('afterend',networkSection);
return;
}
if(state.method==='online'){
const bankSection=`<div id="onlineBankSelection" class="bank-selection"><label class="form-label">Choose a Bank <span class="required">*</span></label><div class="bank-select-wrap"><button type="button" class="bank-select-custom" onclick="toggleBankDropdown()">${state.bank?`<img src="${getBankIcon(state.bank)}" alt="${state.bank}"><span>${state.bank}</span>`:`<span class="bank-placeholder">Select a Bank</span>`}<span class="bank-arrow">▼</span></button><div id="bankDropdown" class="bank-dropdown">${onlineBankOptions.map(bank=>`<button type="button" class="bank-dropdown-item" onclick="chooseOnlineBank('${bank}')"><img src="${getBankIcon(bank)}" alt="${bank}"><span>${bank}</span></button>`).join('')}</div></div></div>`;
$('#channelGrid').insertAdjacentHTML('afterend',bankSection);
}
if((state.method==='qr'&&(state.channel==='vaderpayc1'||state.channel==='vaderpayc2'))||(state.method==='wallet'&&(state.channel==='vaderpayc1'||state.channel==='eziepay'))){
const paymentSources=[['duitNow','DuitNow','duitNow'],['boost','Boost','boost'],['grabpay','GrabPay','grabpay'],['shopee','ShopeePay','shopee'],['touchNgo','Touch ’n Go','touchNgo']];
const acceptsSection=`<div class="accepts-payment"><div class="accepts-payment-title">Accepts Payment From</div><div class="accepts-payment-icons">${paymentSources.map(([asset,name,key])=>`<button type="button" class="accepts-payment-item payment-source-option ${state.walletPayment===key?'selected':''}" onclick="chooseWalletPayment('${key}')"><img src="assets/${asset}.svg" alt="${name}"></button>`).join('')}</div></div>`;
$('#channelGrid').insertAdjacentHTML('afterend',acceptsSection);
}
}
function getWalletPaymentIcon(key){const icons={duitNow:'assets/duitNow.svg',boost:'assets/boost.svg',grabpay:'assets/grabpay.svg',shopee:'assets/shopee.svg',touchNgo:'assets/touchNgo.svg'};return icons[key]||''}function getWalletPaymentName(key){const names={duitNow:'DuitNow',boost:'Boost',grabpay:'GrabPay',shopee:'ShopeePay',touchNgo:'Touch ’n Go'};return names[key]||''}
function getBankIcon(bank){
    const icons={
        'Affin Bank':'assets/bank-afffin.svg',
        'AmBank':'assets/bank-am.svg',
        'Bank Simpanan Nasional':'assets/bank-bsn.svg',
        'Hong Leong Bank':'assets/bank-HLB.svg',
        'Maybank':'assets/bank-maybank.svg',
        'Public Bank Berhad':'assets/bank-Pb.svg',
        'RHB Bank':'assets/bank-RHB.svg',
        'CIMB Bank':'assets/bank-am.svg',
        'Bank Islam':'assets/bank-islam.svg',
        'Bank Rakyat':'assets/bank-rakyat.svg',
        'Alliance Bank':'assets/bank-alliance.svg',
        'OCBC Bank':'assets/bank-ocbc.svg',
        'UOB Bank':'assets/bank-uob.svg'
    };
    return icons[bank]||'';

}

function toggleBankDropdown(){const dropdown=$('#bankDropdown');if(dropdown) dropdown.classList.toggle('show')}

function chooseWalletPayment(key){state.walletPayment=key;renderChannels();renderSummary();renderForm()}
function chooseBank(bank){state.bank=bank;renderChannels();renderForm()}
function chooseOnlineBank(bank){state.bank=bank;renderChannels();renderSummary();renderForm()}
function bankAccountDetails(){return `<div class="bank-card"><h3>Receiving account for this order</h3><div class="account-line"><span>Receiving bank</span><b>${state.bank}</b></div>${[['Bank account name',bankAccount.name],['Bank account number',bankAccount.number]].map(x=>`<div class="fixed-account-field"><span>${x[0]}</span><div><b>${x[1]}</b><button class="copy-icon" title="Copy ${x[0]}" aria-label="Copy ${x[0]}" onclick="copyText('${x[1]}')"><img src="assets/copy-icon.svg" alt=""></button></div></div>`).join('')}</div>`}
function setCryptoNetwork(network){state.cryptoNetwork=network;renderChannels();renderSummary();renderForm()}
function renderSummary(){
if(state.method==='bank'){$('#providerSummary').classList.add('hidden');return}
let c=channels[state.channel],logo=c.logo?`<img src="${c.logo}" alt="${c.name}logo">`:c.mark;
$('#providerSummary').classList.remove('hidden');
let methodLine='';
if(state.method==='online'&&state.bank)methodLine=`<p class="provider-method"><img src="${getBankIcon(state.bank)}" alt="${state.bank}" class="summary-bank-icon"><span>${state.bank}</span></p>`;
else if((state.method==='wallet'||state.method==='qr')&&(state.channel==='vaderpayc1'||state.channel==='vaderpayc2'||state.channel==='eziepay'))methodLine=`<p class="provider-method"><img src="${getWalletPaymentIcon(state.walletPayment)}" alt="${getWalletPaymentName(state.walletPayment)}" class="duitnow-summary-icon"><span>${getWalletPaymentName(state.walletPayment)}</span></p>`;
else if(state.method==='crypto')methodLine=`<p class="provider-method"><img src="assets/${state.cryptoNetwork==='TRC20-USDT'?'tether.svg':'ethereum.svg'}" alt="${state.cryptoNetwork}" class="crypto-summary-icon"><span>${state.cryptoNetwork}</span></p>`;
else if(state.channel==='vaderpayc1'||state.channel==='vaderpayc2')methodLine=`<p class="provider-method"><img src="assets/duitNow.svg" alt="DuitNow" class="duitnow-summary-icon"><span>DuitNow QR · Instant</span></p>`;
$('#providerSummary').innerHTML=`<div class="large-logo ${c.logo?'image-logo':''}">${logo}</div><div><h2>${c.name}</h2>${methodLine}</div>`;
}
function field(label,content){return `<label class="form-label">${label}</label>${content}`}
function amountBlock(c){return `${field(`Deposit amount <span class="required">*</span>`,`<div class="amount-wrap"><span class="currency">MYR</span><input id="amount" inputmode="decimal" placeholder="Enter deposit amount" value="${state.amount}" oninput="setAmount(this.value)"></div><div id="amountHelp" class="input-help">Per transaction: ${money(c.min)} – ${money(c.max)}</div>`)}<div class="quick-amounts">${[20,50,100,200,500].map(v=>`<button onclick="quickAmount(${v})">MYR ${v}</button>`).join('')}</div>`}
function renderForm(){let c=channels[state.channel], specific='';
 if(state.channel==='banktransfer') specific=`${amountBlock(c)}<div class="form-row"><div>${field('Transfer Type <span class="required">*</span>',`<select class="form-control"><option>Internet Banking</option><option>ATM</option><option>CDM</option><option>SMS Banking</option></select>`)}</div><div>${field('Sender account name',`<input class="form-control" placeholder="Enter sender account name">`)}</div></div>${field('Transfer receipt (optional)',`<div class="upload-box">A receipt may help us process your request faster.<br>JPG, PNG, or PDF · maximum 10MB<br><label>Select file<input type="file" onchange="showToast('Transfer receipt selected')"></label></div>`)}<div class="notice" style="margin-top:18px"><b>!</b><span>Please pay only to the account shown on this order. Do not transfer to previous or other accounts.</span></div>`;
 else if(state.channel==='usdt') specific=`<div class="crypto-selection"><span>Asset</span><b>USDT</b><span>Network</span><b>${state.cryptoNetwork}</b></div><div class="notice"><b>!</b><span>Crypto quotes may change with the market. This quote refreshes in 05:00.</span></div>${amountBlock(c)}<div class="crypto-info"><div>Currency conversion <strong id="usdtEstimate">~ 0.0000 ${state.cryptoNetwork}</strong></div><div>Current rate <strong>1 MYR ≈ 0.2477 ${state.cryptoNetwork}</strong></div><div>Minimum deposit <strong>${money(c.min)}</strong></div><div>Quote valid for <strong>05:00</strong></div></div>`;
 else {let warning=state.channel==='eziepay'?`<div class="notice"><b>!</b><span>This channel has a ${money(500)} maximum per transaction. Choose another channel for a higher amount.</span></div>`:'';specific=`${warning}${amountBlock(c)}`}
 const label=state.channel==='banktransfer'?'Submit transfer request':state.channel==='usdt'?'Continue':state.method==='qr'?'Generate payment QR code':`Continue with ${c.name}`;
 $('#dynamicForm').innerHTML=`${specific}<button id="submitBtn" class="primary-button" onclick="submitDeposit()">${label}</button><div class="security-copy">▣ <span>Your payment details are encrypted. Never share your order details with anyone.</span></div>`;validate(); }
function setMethod(id){state.method=id;state.filter='all';let first=methods[id].channels.find(x=>!channels[x].disabled);state.channel=first;state.amount='';if(id!=='online')state.bank='';state.walletPayment='duitNow';render()}
function selectChannel(id){if(channels[id].disabled){showToast('This channel is under maintenance. Please choose another method.');return}state.channel=id;state.amount='';if(state.method==='online')state.bank='';if(state.method==='wallet'||state.method==='qr')state.walletPayment='duitNow';render()}
function setFilter(v){state.filter=v;renderChannels()}
function setAmount(v){state.amount=v;validate();if(state.channel==='usdt')$('#usdtEstimate').textContent=`~ ${(Number(v||0)*.2477).toFixed(4)} ${state.cryptoNetwork}`}
function quickAmount(v){state.amount=v;let a=$('#amount');if(a)a.value=v;validate();if(state.channel==='usdt')$('#usdtEstimate').textContent=`~ ${(v*.2477).toFixed(4)} ${state.cryptoNetwork}`}
function validate(){let c=channels[state.channel], amount=Number(state.amount),help=$('#amountHelp'),btn=$('#submitBtn');if(!help||!btn)return;let invalid=state.amount!==''&&(isNaN(amount)||amount<c.min||amount>c.max);if(state.amount===''){help.textContent=`Per transaction: ${money(c.min)} – ${money(c.max)}`;help.className='input-help';btn.disabled=true}else if(invalid){help.textContent=amount<c.min?`Minimum deposit is ${money(c.min)}`:amount>c.max?`Maximum deposit is ${money(c.max)}`:'Enter a valid amount';help.className='input-help error';btn.disabled=true}else{help.textContent='Amount is within this channel’s limit';help.className='input-help';btn.disabled=false}let inp=$('#amount');if(inp)inp.classList.toggle('error',invalid)}

function depositReminderStyles(){
if($('#depositReminderStyle'))return;
const s=document.createElement('style');s.id='depositReminderStyle';s.textContent=`#depositReminderBackdrop{position:fixed;inset:0;background:rgba(9,24,44,.48);display:flex;align-items:center;justify-content:center;z-index:99999;padding:20px;box-sizing:border-box}#depositReminderBox{width:min(440px,100%);background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(10,30,60,.22);padding:26px;box-sizing:border-box;font-family:inherit;color:#10243f}#depositReminderBox .dr-icon{width:42px;height:42px;border-radius:50%;background:#fff3d6;color:#b77900;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;margin-bottom:14px}#depositReminderBox h3{margin:0 0 8px;font-size:20px;color:#10243f}#depositReminderBox p{margin:0 0 18px;color:#627795;line-height:1.55;font-size:14px}#depositReminderBox .dr-selection{background:#f4f7fb;border:1px solid #e0e7f0;border-radius:10px;padding:10px 14px;margin-bottom:20px;font-weight:600;color:#10243f;display:flex;align-items:center;gap:10px;min-height:44px;box-sizing:border-box}#depositReminderBox .dr-payment-icon{width:30px;height:30px;object-fit:contain;flex:0 0 30px}#depositReminderBox .dr-actions{display:flex;gap:10px;justify-content:flex-end}#depositReminderBox button{min-height:44px;padding:0 18px;border-radius:9px;border:0;font-weight:700;cursor:pointer;font-size:14px}#depositReminderBox .dr-back{background:#eef2f7;color:#34506f}#depositReminderBox .dr-continue{background:#2879e8;color:#fff}`;
document.head.appendChild(s)
}
function showDepositReminder(title,message,selection,onContinue,actionLabel='Continue'){
depositReminderStyles();
let old=$('#depositReminderBackdrop');if(old)old.remove();
const el=document.createElement('div');el.id='depositReminderBackdrop';el.innerHTML=`<div id="depositReminderBox" role="dialog" aria-modal="true" aria-labelledby="depositReminderTitle"><div class="dr-icon">!</div><h3 id="depositReminderTitle">${title}</h3><p>${message}</p>${selection?`<div class="dr-selection">${selection==='DuitNow'?`<img src="assets/duitNow.svg" alt="DuitNow" class="dr-payment-icon">`:selection==='Boost'?`<img src="assets/boost.svg" alt="Boost" class="dr-payment-icon">`:selection==='GrabPay'?`<img src="assets/grabpay.svg" alt="GrabPay" class="dr-payment-icon">`:selection==='ShopeePay'?`<img src="assets/shopee.svg" alt="ShopeePay" class="dr-payment-icon">`:selection==='Touch ’n Go'?`<img src="assets/touchNgo.svg" alt="Touch ’n Go" class="dr-payment-icon">`:selection==='TRC20-USDT'?`<img src="assets/tether.svg" alt="TRC20-USDT" class="dr-payment-icon">`:selection==='ERC20-USDT'?`<img src="assets/ethereum.svg" alt="ERC20-USDT" class="dr-payment-icon">`:''}<span>${selection}</span></div>`:''}<div class="dr-actions">${actionLabel==='Choose Bank'?`<button type="button" class="dr-continue" style="width:100%" onclick="closeDepositReminder();toggleBankDropdown()">Choose Bank</button>`:`<button type="button" class="dr-back" onclick="closeDepositReminder()">Back</button><button type="button" class="dr-continue" onclick="closeDepositReminder();${onContinue}">${actionLabel}</button></>`}</div></div>`;
document.body.appendChild(el);
el.onclick=e=>{if(e.target===el)closeDepositReminder()};
}
function closeDepositReminder(){let el=$('#depositReminderBackdrop');if(el)el.remove()}
function processDeposit(){let btn=$('#submitBtn');if(!btn)return;btn.disabled=true;btn.textContent='Creating secure payment order…';setTimeout(()=>{btn.disabled=false;openModal()},700)}

function submitDeposit(){
let btn=$('#submitBtn');if(!btn||btn.disabled)return;
if(state.method==='online'&&!state.bank){
showDepositReminder('Choose a bank','Please select a bank before continuing.','Choose a bank to receive the payment instruction.','', 'Choose Bank');
return
}
if((state.method==='qr'||state.method==='wallet')&&(state.channel==='vaderpayc1'||state.channel==='vaderpayc2'||state.channel==='eziepay')){
const name=getWalletPaymentName(state.walletPayment)||'a payment method';
showDepositReminder('Check your payment method','Please make sure you have selected your preferred payment method before continuing.',name,'');
return
}
if(state.method==='crypto'){
showDepositReminder('Check your crypto network','Please confirm that the selected crypto network matches the network you will use to make the deposit.',state.cryptoNetwork,'');
return
}
if(state.channel==='banktransfer'){
showDepositReminder('Check your transfer details','Please review your bank transfer details and make sure you are paying to the correct account.', 'Bank transfer details','');
return
}
processDeposit()
}

function openModal(){let c=channels[state.channel], isCrypto=state.channel==='usdt',isBank=state.channel==='banktransfer';let body=isBank?`<h2>Transfer request submitted</h2><p>Please keep the order number. Your balance will update automatically when the review is complete.</p><div class="payment-detail"><span>Order number</span><b>DEP20260820-9821</b></div><div class="payment-detail"><span>Status</span><b class="countdown">Under review</b></div><div class="payment-detail"><span>Estimated processing time</span><b>5–15 minutes</b></div>`:isCrypto?`<h2>USDT deposit address</h2><p>Send USDT to this address using the specified network.</p><div class="qr"></div><div class="payment-detail"><span>Network</span><b>${state.cryptoNetwork}</b></div><div class="payment-detail"><span>Wallet address</span><b>0x9F6a...81cD <button class="copy-button" onclick="copyText('0x9F6a3C8d1f88A3c4B7dE7A6f1F10b39881cD')">Copy</button></b></div><div class="network">Do not send assets other than USDT on the selected ${state.cryptoNetwork} network to this address. They may not be recoverable.</div>`:`<h2>Payment QR code generated</h2><p>Scan this QR code with a supported wallet to complete payment.</p><div class="qr"></div><div class="payment-detail"><span>Amount due</span><b>${money(state.amount)}</b></div><div class="payment-detail"><span>Order status</span><b class="countdown">Waiting for payment · 14:58</b></div><div class="payment-detail"><span>Order number</span><b>DEP20260820-9821</b></div>`;$('#modal').innerHTML=`${body}<div class="modal-actions"><button class="secondary-button" onclick="closeModal()">${isCrypto?'Edit amount':'Close'}</button><button class="primary-button" onclick="closeModal();showToast('${isBank?'Request received. We will process it shortly.':'Checking payment status'}')">${isBank?'Done':'I have paid'}</button></div>`;$('#modalBackdrop').classList.remove('hidden')}
function closeModal(){$('#modalBackdrop').classList.add('hidden')}
function copyText(t){navigator.clipboard?.writeText(t);showToast('Account details copied')}
function showToast(t){let el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),2400)}
const cryptoSummaryStyle=document.createElement('style');cryptoSummaryStyle.textContent='.crypto-summary-icon{width:24px;height:24px;object-fit:contain;vertical-align:middle;margin-right:8px}';document.head.appendChild(cryptoSummaryStyle);
$('#modalBackdrop').onclick=e=>{if(e.target.id==='modalBackdrop')closeModal()};render();
