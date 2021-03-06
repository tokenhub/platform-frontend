import React from 'react';
import T from '../tags.jsx';


class PageWallets extends T.Page {
	constructor(props) {
		super(props);
		props.m.api.getCurrenciesRate();
		props.m.api.getWallets();
	}
	render(p,s,c,m) {
		if (!m.user || !m.user.wallets) {
			return this.renderLoading(p,s,c,m);
		} else if (p.walletId || s.walletId) {
			return this.renderWallet(p,s,c,m);
		} else {
			return this.renderWalletsList(p,s,c,m);
		}
	}
	renderLoading(p,s,c,m) {
		return <T.Page.PageWrapDevice m={m} pagePostfix="wallet">
			<T.Page.PageWrapProfile key="header" m={m} header="left" {...s}>
				<T.Page.PageWrapProfileLeft>
					<T.Headers.Left m={m} {...p}  tab="wallets" />
				</T.Page.PageWrapProfileLeft>
				<T.Page.PageWrapProfileWidth skipLogo={m.device.isMobile}>
					<h1>loading...</h1>
				</T.Page.PageWrapProfileWidth>
			</T.Page.PageWrapProfile>
		</T.Page.PageWrapDevice>;
	}
	renderWalletsList(p,s,c,m) {
		return <T.Page.PageWrapDevice m={m} pagePostfix="wallet">
			<T.Page.PageWrapProfile key="header" m={m} header="left" {...s}>
				<T.Page.PageWrapProfileLeft>
					<T.Headers.Left m={m} {...p}  tab="wallets" />
				</T.Page.PageWrapProfileLeft>
				<T.Page.PageWrapProfileWidth skipLogo={m.device.isMobile}>
					<h1>Wallets</h1>
					<div className="wallets-list">
						{m.user.wallets.map((v,i)=>{
							return <T.A m={m}
									key={"wallet"+i} className={"wallet wallet-"+v.symbol}
									href={"/wallets/"+v.symbol}
								>
								<div className={"icon-currency-horizontal icon-currency-"+v.symbol}></div>
								<div className="d-flex flex-row justify-content-between">
									{v.name}
									<span>
										<T.Currency m={m} {...v} id={v.symbol} />
									</span>
								</div>
								<div className="in-usd">
									<T.Currency m={m} {...v} usd />
								</div>
							</T.A>;
						})}
					</div>
				</T.Page.PageWrapProfileWidth>
			</T.Page.PageWrapProfile>
		</T.Page.PageWrapDevice>;
	}
	renderWallet(p,s,c,m) {
		var wallet = m.user.wallets.filter(v=>v.symbol==p.walletId)[0];
		var tab = s.tab || "transactions";
		// var tab = s.tab || "receive";
		return <T.Page.PageWrapDevice m={m} pagePostfix="wallet">
			<T.Page.PageWrapProfile key="header" m={m} header="left" {...s}>
				<T.Page.PageWrapProfileLeft>
					<T.Headers.Left m={m} {...p}  tab="wallets" />
				</T.Page.PageWrapProfileLeft>
				<div className="w-100">
					{this.renderWallet_header(p,s,c,m)}
					<div className="profile-center">
						{c}
						{tab=="transactions"?this.renderWallet_transactions(p,s,c,m):null}
						{0 && tab=="tokens"?this.renderWallet_tokens(p,s,c,m):null}
						{tab=="send"?this.renderWallet_send(p,s,c,m):null}
						{tab=="receive"?this.renderWallet_receive(p,s,c,m):null}
						{tab=="settings"?this.renderWallet_settings(p,s,c,m):null}
					</div>
				</div>
			</T.Page.PageWrapProfile>
		</T.Page.PageWrapDevice>;
	}
	renderWallet_header(p,s,c,m) {
		var wallet = m.user.wallets.filter(v=>v.symbol==(p.walletId||s.walletId))[0];
		var style = {};
		var img = wallet.symbol.toLowerCase();
		if (img=='tnk') img = 'ins';
		if (m.device.isMobile) {
			img += "-mobile-"+ m.device.retina +"x.jpg";
			style.background = "#302840 url(./img/wallet-header-"+img+") center top no-repeat";
			style.backgroundSize = "200px 434px";
			style.paddingBottom = "37px";
		} else {
			img += ".png";
			style.background =  "#312c42 url(./img/wallet-header-"+img+") right top no-repeat";
		}
		return <div
			className="bg-violet" style={style}
		>
			<div className="profile-center wallet-page-header">
				<h1 style={{
					marginTop:m.device.isMobile?"-21px":"",
					marginBottom:m.device.isMobile?"3px":""
				}}>{wallet.name}</h1>
				<div className="wallet-page-stat">
					<T.Currency m={m} {...wallet} />
					<br />
					<span className="in-usd">
						<T.Currency m={m} {...wallet} usd />
					</span>
				</div>
				<div className={
					"btn-group btn-group-toggle d-flex justify-content-start flex-wrap" + (m.device.isMobile?" flex-column":"")
				}>
					<div className={"btn "+ ((p.tab||s.tab||"transactions")=="transactions"?" btn-secondary active":" btn-outline-secondary")}
						onClick={()=>this.setState({tab:"transactions"})} style={{marginLeft:m.device.isMobile?"-1px":""}}
					>
						TRANSACTIONS
					</div>
					<div className={"btn "+ ((p.tab||s.tab)=="tokens"?" btn-secondary active":" btn-outline-secondary")}
						onClick={()=>this.setState({tab:"tokens"})}
						style={{display:"none"}}
					>
						TOKENS
					</div>
					<div className={"btn "+ ((p.tab||s.tab)=="send"?" btn-secondary active":" btn-outline-secondary")}
						onClick={()=>this.setState({tab:"send"})} style={{marginTop:m.device.isMobile?"-1px":""}}
					>
						SEND
					</div>
					<div className={"btn "+ ((p.tab||s.tab)=="receive"?" btn-secondary active":" btn-outline-secondary")}
						onClick={()=>this.setState({tab:"receive"})} style={{marginTop:m.device.isMobile?"-1px":""}}
					>
						RECEIVE
					</div>
					<div className={"btn "+ ((p.tab||s.tab)=="settings"?" btn-secondary active":" btn-outline-secondary")}
						onClick={()=>this.setState({tab:"settings"})} style={{marginTop:m.device.isMobile?"-1px":""}}
					>
						SETTINGS
					</div>
				</div>
			</div>
		</div>;
	}
	renderWallet_tokens(p,s,c,m) {
		return <div className="transactions-tokens">
			<div className="mt-4 d-flex justify-content-between align-items-center">
				<h2>Tokens</h2>
				<T.Checkbox checked={s.showEmptyBalances} onChange={(on)=>this.setState({showEmptyBalances:on})}>
					Show empty balances
				</T.Checkbox>
			</div>
			<table className="table-transactions-tokens w-100">
				<tbody>
					<tr>
						<th>Augur</th><td>REP</td><td className="w-100 text-right">0.00 REP</td>
					</tr>
					<tr>
						<th>Bancor</th><td>BNT</td><td className="w-100 text-right">0.00 BNT</td>
					</tr>
					<tr>
						<th>Basic Attention Token</th><td>BAT</td><td className="w-100 text-right">0.00 BAT</td>
					</tr>
					<tr>
						<th>Binance</th><td>BNB</td><td className="w-100 text-right">0.00 BNB</td>
					</tr>
				</tbody>
			</table>
		</div>;
	}
	renderWallet_transactions(p,s,c,m) {
		return <TransactionsTable {...p} {...s} />;
	}
	renderWallet_send(p,s,c,m) {
		return <SendTokens {...p} {...s} m={m} after={()=>this.setState({tab:"transactions"})} />;
	}
	renderWallet_receive(p,s,c,m) {
		return <Receiver {...p} {...s} />;
	}
	renderWallet_settings(p,s,c,m) {
		return <Settings {...p} {...s} />;
	}
}

class Receiver extends T.Any {
	constructor(props) {
		super(props);
		props.m.api.loadLib_clipboardjs()
		.then(()=>{
			new ClipboardJS(this.copy);
		});
		props.m.api.loadLib_qrcode()
		.then(()=>{
			var p = this.props;
			var wallet = p.m.user.wallets.filter(v=>v.symbol==p.walletId)[0];
			qrcodelib.toDataURL(T.TX.href(p.m, true, wallet.address||"n/a"), (err, url)=>{
				this.setState({qrDataUrl:url});
			});
		});
	}
	render(p,s,c,m) {
		var wallet = p.m.user.wallets.filter(v=>v.symbol==p.walletId)[0];
		return <div>
			<h2>RECEIVE</h2>
			<h3>RECEIVING ADDRESS</h3>
			<div
				style={{
					border:"1px solid #e5e6e7",padding:"15px",
					marginBottom:m.device.isMobile?"15px":""
				}}
				className={"d-flex align-items-center"+(m.device.isMobile?" flex-column":" justify-content-stretch")}
			>
				<T.A external m={m} href={T.TX.href(p.m, true, wallet.address||"n/a")}>
					<img src={s.qrDataUrl} width="228" height="228" alt={s.qrDataUrl?"QR code is loading...":"QR code for "+ wallet.address} />
				</T.A>
				<div
					className={(m.device.isMobile?" d-flex flex-column align-items-center":"")}
					style={{
						display:m.device.isMobile?"block":"",
						wordBreak:m.device.isMobile?"break-all":"",
						textAlign:m.device.isMobile?"center":"",
						flex:1,
						width:"100%"
					}}
				>
					<input
						id="receiverId"
						readOnly value={wallet.address}
						style={{
							margin: m.device.isMobile ? "2px 0 8px 0" : "",
							border: 0,
							padding: 0,
							width: "100%",
							textAlign: m.device.isMobile ? "center" : ""
						}}
					/>
					<div className="mr-2 mb-2">
						Receiver
					</div>
					<div>
						<button
							type="button" ref={el=>this.copy=el} data-clipboard-target="#receiverId"
							className="btn-link pl-0 mr-0"
							style={{color:"inherit"}}
						>
							Copy
							<span className="icon icon-24 icon-copy" />
						</button>
					</div>
				</div>
			</div>
			<h3 style={{display:"none"}}>OTHER ADDRESSES</h3>
			<div
				style={{border:"1px solid #e5e6e7",padding:"15px",display:"none"}}
				className="align-items-center"
			>
				<div
					style={{marginRight:"15px",paddingRight:"15px",borderRight:"1px solid #e5e6e7"}}
					className="align-self-stretch"
				>
					<b>Receiver</b>
					<br />
					0x298DB031c12294c7235D00ef6380a4B53c9619a3
				</div>
				<div
					className="d-flex justify-content-between w-100"
				>
					<div>
						<span className="mr-3">
							<span className="icon icon-24 icon-copy"></span>
							Copy
						</span>
						<span>
							<span className="icon icon-24 icon-qr"></span>
							QR-code
						</span>
					</div>
					<div>
						0.1234ETH
					</div>
				</div>
			</div>
		</div>;
	}
	rename() {

	}
}

class Settings extends T.Any {
	constructor(props) {
		super(props);
		var wallet = props.m.user.wallets.filter(v=>v.symbol==props.walletId)[0];
		this.setState({name: wallet.name});
	}
	render (p,s,c,m) {
		var wallet = m.user.wallets.filter(v=>v.symbol==p.walletId)[0];
		return <div>
			<h2>SETTINGS</h2>
			<h3>CHANGE WALLET NAME</h3>
			<T.Form handler={this}>
				<T.Input
					required placeholder="Wallet name" inputGroupCls="border4sides"
					value={s.name||""}
					onChange={(name,nameValid)=>{this.setState({name,nameValid:!!nameValid})}}
				/>
				<div className="mt-4">
					<T.Form.SubmitButton
						canSubmit={s.name && s.name!=wallet.name} fetching={s.fetching}
						clsColor="btn-primary" cls="btn-lg"
						text="Save changes"
					/>
				</div>
			</T.Form>
		</div>;
	}
	onSubmit() {
		return this.props.m.api.updateWalletName(this.props.walletId, this.state.name)
		.then(()=>{
			this.props.m.api.getWallets();
		});
	}
}

class SendTokens extends T.Any {
	constructor(props) {
		super(props);
		// debugger;
		this.setState({
			currency: props.currency || props.walletId || "ETH",
			priority: props.priority || "medium",
			to: null,// "0xBA46454801BBFB741FFc6Addf58dc6C2cC061FD7",
			specifyCustomGasLimit: false,
			isReview: false,
			isReport: false,
			transactionSending: 0,
			transactionSent: 0,
			transactionSendEr: 0 && {
				message: "khm",
				errors: null
			}
		});
	}
	render(p,s,c,m) {
		if (s.transactionSending) {
			return this.render_report(p,s,c,m);
		} else if (s.transactionSent) {
			return this.render_sent(p,s,c,m);
		} else if (!s.isReview && !s.isReport) {
			return this.render_form(p,s,c,m);
		} else if (s.isReview) {
			return this.render_review(p,s,c,m);
		} else {
			return this.render_report(p,s,c,m);
		}
	}
	render_form(p,s,c,m) {
		var wallet = m.user.wallets.filter(v=>v.symbol==s.currency)[0];
		// wallet = JSON.parse(JSON.stringify(wallet));
		// wallet.balance = 12345 * Math.pow(10,wallet.format*1) +'';
		var inUsd = null;
		if (wallet) {
			var inUsd = T.Currency.asText(p,false,true,s.currency,s.amount);
			var inWei = "";
			if (s.amount) {
				inWei = T.Currency.coin2wei(s.amount||0, wallet.format) + "wei";
				inWei = T.Currency._2number(T.Currency.coin2wei(s.amount||0, wallet.format), true) + "wei";
			}
			inUsd = [inUsd, inWei].filter(v=>!!v).join(" ");
		}
		var max = T.Currency.maxNoWei(m,wallet);
		var maxIsZero = max.isZero();
		return <div>
			<h2>SEND</h2>
			<p>This form allows you to spend funds from your wallet. Always double check your destination address!</p>
				<T.If v={1}><div style={{maxWidth:"482px"}}><T.Form handler={this}>
					<T.Input.TxAdr
						name="to" placeholder="Send to" inputGroupCls="border4sides"
						onChange={this.onTo.bind(this)} value={s.to||""} required
					/>
					<div className="d-flex">
						<T.Select
							useFormControl className="form-control mr-3" inputGroupCls="border4sides"
							placeholder="Currency"
							required onChange={this.onCurrency.bind(this)} value={s.currency}
							options={
								m.user.wallets.map(v=>{
									return {value:v.symbol,title:v.symbol +" - "+ v.name};
								})
							}
						/>
						<T.Input.Float
							bn min={0} aboveMin={true} max={max} belowMax={false} required
							onChange={this.onAmount.bind(this)} value={wallet ? s.amount : ""}
							hint={maxIsZero ? "Low funds" : s.amountValid ? inUsd : null}
							hasError={maxIsZero}
							placeholder="Amount" autocomplete="off" inputGroupCls="border4sides"
						/>
					</div>
					<div style={{display:"none"}}>
						<T.Select
							useFormControl className="form-control" placeholder="Priority"
							required onChange={this.onPriority.bind(this)} value={s.specifyCustomGasLimit ? "custom" : s.priority}
							options={[
								{value:"low",title:"Low"},
								{value:"medium",title:"Medium"},
								{value:"high",title:"High"},
								s.specifyCustomGasLimit ? {value:"custom",title:"Custom"} : null,
							].filter(v=>!!v)}
							disabled={s.specifyCustomGasLimit}
						/>
						<T.Checkbox checked={s.specifyCustomGasLimit} onChange={this.onSpecifyCustomGasLimit.bind(this)}>
							Specify custom gas limit (advanced users)
						</T.Checkbox>
						<T.If v={s.specifyCustomGasLimit}><div>
							<T.Input.Float
								name="customFee" placeholder="Custom fee" min={0} aboveMin={true} exampleNum={0.01}
								onChange={this.onCustomFee.bind(this)} value={s.customFee} required
							/>
							<T.Input.Float
								name="gasLimit" placeholder="Gas limit" min={0} aboveMin={true} exampleNum={0.01}
								onChange={this.onAmount.bind(this)} value={s.amount} required
							/>
						</div></T.If>
					</div>
					<T.Textarea v={s.note||""} onChange={this.onNote.bind(this)} />
					<div className="mt-4">
						<T.Form.SubmitButton
							clsColor="btn-primary" cls="btn-lg"
							canSubmit={s.canSubmit} fetching={s.fetching}
							text="REVIEW"
						/>
					</div>
				</T.Form></div></T.If>
		</div>;
	}
	onSubmit() {
		return new Promise(resolve=>{
			this.setState({isReview:true}, ()=>{resolve();});
		});
	}
	checkValid(partial) {
		var s = this.state;
		var wallet = this.props.m.user.wallets.filter(v=>v.symbol==s.currency)[0];
		var canSubmit = !!wallet;
		this.form.changeFormState(this, ['toValid','amountValid'], canSubmit, partial);
	}
	onTo(to,toValid) {
		this.checkValid({to:to.trim(),toValid});
	}
	onCurrency(currency,currencyValid) {
		this.checkValid({currency,currencyValid});
	}
	onAmount(amount,amountValid) {
		this.checkValid({amount,amountValid});
	}
	onCustomGasLimit(customGasLimit,customGasLimitValid) {
		this.setState({customGasLimit,customGasLimitValid});
	}
	onPriority(priority,priorityValid) {
		this.setState({priority,priorityValid});
	}
	onSpecifyCustomGasLimit(on) {
		this.setState({specifyCustomGasLimit:on});
	}
	onCustomFee(customFee,customFeeValid) {
		this.setState({customFee,customFeeValid});
	}
	onNote(note) {
		this.setState({note})
	}
	render_review(p,s,c,m) {
		return <div>
			<div style={{maxWidth:"548px"}}>
				<h2>REVIEW YOUR TRANSACTION</h2>
				<div style={{border: "1px solid #e5e6e7", padding:"15px"}}>
					<div style={{}}>
						You are about to send the following transaction:
						<br />
						<b><T.Currency {...p} id={s.currency} isWei={false} value={s.amount} /></b> to <b>{s.to}</b>
					</div>
					<div style={{borderTop: "1px solid #e5e6e7", paddingTop:"15px", marginTop:"15px"}}>
						<b><T.Currency {...p} id={s.currency} isWei={false} value={s.amount} /></b> in total.
						<div className="mt-4">
							<button type="button"
								className={[
									"btn btn-lg btn-outline-primary",
									"mr-2"
								].join(" ")}
								style={{fontWeight:600}}
								onClick={()=>{this.setState({isReview:false});}}
							>
								Cancel
							</button>
							<button type="button"
								className={[
									"btn btn-lg btn-primary",
								].join(" ")}
								onClick={()=>{this.setState({isReview:false,isReport:true});}}
							>
								Sign transaction
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>;
	}
	render_report(p,s,c,m) {
		return <div>
			{this.render_review(p,s,c,m)}
			<T.Popup.Put2fa
				{...p}
				makePromise={code=>{
					var s = this.state;
					var wallet = this.props.m.user.wallets.filter(v=>v.symbol==s.currency)[0];
					this.setState({transactionSent:false,transactionSending:true,transactionSendEr:null});
					var inWei = T.Currency.coin2wei(s.amount, wallet.format);
					return this.props.m.api.withdraw(
						s.note,
						code,
						inWei,
						s.to,
						wallet.tokenContractAddress
					)
					.then(x=>{
						this.setState({transactionSent:true,transactionSending:false,transactionSendEr:null});
						return this.props.m.api.getWallets();
					})
					.catch(x=>{
						if ((x && x.message||"").toLowerCase().indexOf("Verification code".toLowerCase())>-1) {
							throw x;
						}
						if ((x && x.message||"").toLowerCase().indexOf("Verification code".toLowerCase())==-1) {
							this.setState({transactionSent:true,transactionSending:false,transactionSendEr:x});
						}
					});
				}}
			/>
		</div>;
	}
	render_sending(p,s,c,m) {
		return <div>
			<h2>Sending...</h2>
			<T.If v={s.transactionSendEr}><div>
				<T.Form.ServerError {...s.transactionSendEr} />
			</div></T.If>
			<div>
				<br />
				<button type="button"
					className={[
						"btn btn-lg btn-outline-primary",
						s.transactionSending ? "disabled" : ""
					].filter(v=>!!v).join(" ")}
					style={{fontWeight:600}}
					disabled={s.transactionSending}
					onClick={()=>{this.setState({
						transactionSendEr: null,
						isReview: false,
						isReport: false,
						transactionSending:false,
						transactionSent:false,
					});}}
				>
					Back
				</button>
			</div>
		</div>;
	}
	render_sent(p,s,c,m) {
		var wallet = m.user.wallets.filter(v=>v.symbol==p.walletId)[0];
		return <div>
			<T.If v={!s.transactionSendEr}><div>
				<h2>YOUR TRANSACTION HAS BEEN SENT</h2>
				<p>
					You transaction has been successfully sent to the network.
					<br />
					Please remember that it may take some time for your transcation to hit the network.
				</p>
				<div className="mt-4">
					<T.A
						{...p}
						href={"/wallets/"}
						className={[
							"btn btn-lg btn-outline-primary mr-3",
						].filter(v=>!!v).join(" ")}
						style={{fontWeight:600}}
					>BACK</T.A>
					<button
						{...p}
						href={"/wallets/"+wallet.symbol}
						onClick={p.after}
						className={[
							"btn btn-lg btn-primary",
						].filter(v=>!!v).join(" ")}
						style={{fontWeight:400}}
					>VIEW ON BLOCKCHAIN EXPLORER</button>
				</div>
			</div></T.If>
			<T.If v={s.transactionSendEr}><div>
				<h2>ERROR</h2>
				<T.Form.ServerError {...s.transactionSendEr} />
				<div className="mt-4">
					<button type="button"
						className={[
							"btn btn-lg btn-primary mr-3",
						].filter(v=>!!v).join(" ")}
						style={{fontWeight:600}}
						onClick={()=>{this.setState({
							transactionSendEr: null,
							isReview: false,
							isReport: false,
							transactionSending:false,
							transactionSent:false,
						});}}
					>BACK</button>
				</div>
			</div></T.If>
		</div>;
	}
}

class TransactionsTable extends T.Any {
	constructor(props) {
		super(props);
		this.setState({page:0,transactions:[]});
		this.load();
	}
	load() {
		this.setState({loading:true});
		this.props.m.api.getTransactions(this.props.walletId)
		.then(transactions=>{
			this.setState({loading:false,transactions,serverEr:null});
		})
		.catch(serverError=>{
			this.setState({loading:false,transactions:null,serverError});
		})
	}
	render_loading(p,s,c,m) {
		return <div>
			<h2>Transactions are loading...</h2>
		</div>;
	}
	render_empty(p,s,c,m) {
		return <div>
			<h2>No transactions found</h2>
			<T.Form.ServerError serverError={s.serverError} />
		</div>;
	}
	render(p,s,c,m) {
		if (s.loading) {
			return this.render_loading(p,s,c,m);
		}
		var transactions = s.transactions;
		if (!transactions || !transactions.length) {
			return this.render_empty(p,s,c,m);
		}
		var byDays = T.Date.groupByDay(
			JSON.parse(JSON.stringify(transactions)),
			v=>{
				return v.executeDate || v.createDate;
			}
		);
		return <div className="transactions-list">
			<h2>TRANSACTIONS</h2>
			{byDays.map((transactions,i)=>{
				return <div key={i}>
					<h3><T.Date onlyDate v={new Date(transactions[0].executeDate || transactions[0].createDate)} mutes={{y:1}} /></h3>
					{transactions.map((v,i)=>{
						var opened = (s.openedTransactions||{})[""+v.id];
						var descIsSmall = (v.comment || "").length < 100;
						var tx, isSystemId;// = tx in v ? v.tx || v.address
						if ('ethereumTransactionHash' in v) {
							isSystemId = false;
							tx = v.ethereumTransactionHash;
							if (!tx) {
								isSystemId = true;
								tx = ''+v.id;
							}
						} else if ('tx' in v) {
							isSystemId = false;
							tx = v.tx;
						} else {
							isSystemId = true;
							tx = ''+v.id;
						}
						var isPositive = T.Currency.isPositive(v, true);
						var colorCls = isPositive===false ? "red" : isPositive ? "green" : "" ;
						return <div key={"-"+i} className={"transaction-container" + (opened?" opened":" closed")}
							onClick={()=>{
								var t = JSON.parse(JSON.stringify(s.openedTransactions||{}));
								t[v.id] = !t[v.id];
								this.setState({openedTransactions:t});
							}}
						>
							<div className={"transaction-header d-flex"+(m.device.isMobile?" justify-content-between":"")}>
								<div className="transaction-toggler">
									{opened?"–":"+"}
								</div>
								<div className="transaction-value">
									<span className={colorCls}>
										<T.Currency m={m} {...v} value={v.sum} id={v.tokenContractAddress} />
									</span>
								</div>
								<div className="transaction-type">
									{v.type.replace(/_/g, ' ').toLowerCase()+', '}
									<T.If v={v.status=="EXECUTED"}>
										<span>{v.status.replace(/_/g, ' ').toLowerCase()}</span>
									</T.If>
									<T.If v={v.status!="EXECUTED"}>
										<span className="red">{v.status.replace(/_/g, ' ').toLowerCase()}</span>
									</T.If>
								</div>
								<T.If v={!m.device.isMobile}>
									<div className="transaction-time">
										<T.Date onlyTime v={new Date(v.date || v.executeDate || v.createDate)} />
									</div>
								</T.If>
							</div>
							{opened?
								<div className={"transaction-details d-flex"+(m.device.isMobile?" flex-column":"")}>
									<T.If v={m.device.isMobile}>
										<div className="transaction-details-field">
											<i><T.Date onlyTime v={new Date(v.date || v.executeDate || v.createDate)} /></i>
										</div>
									</T.If>
									<div className="transaction-details-field">
										<i>Transaction ID</i>
										<br />
										<div className="text-truncate">
											<T.If v={isSystemId}><span>
												systemId#{tx}
											</span></T.If>
											<T.If v={!isSystemId}>
												<T.TX tx={tx} fullAdrOnDesktop={descIsSmall} fullAdr={m.device.isMobile} {...p} />
											</T.If>
										</div>
										{
											descIsSmall?null:
											v.confirmations&&<span>
												<br />
												<i>Confirmations</i>
												<br />
												{v.confirmations}
											</span>
										}
										<T.If v={v.address}><span>
											<br />
											<i>Address</i>
											<br />
											<T.TX isAdr tx={v.address} fullAdrOnDesktop={descIsSmall} fullAdr={!m.device.isMobile} {...p} />
										</span></T.If>
									</div>
									{descIsSmall?v.confirmations&&<div className="transaction-details-field">
										<i>Confirmations</i>
										<br />
										{v.confirmations}
									</div>:null}
									<div className={"transaction-details-field"} style={{flex:1,marginRight:"0"}}>
										<i>Description</i>
										<br />
										{v.comment || "No description"}
									</div>
								</div>
							:null}
						</div>;
					})}
				</div>;
			})}
		</div>;
	}
};

export default PageWallets;
