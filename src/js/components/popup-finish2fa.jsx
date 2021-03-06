import React from 'react';
import Any from '../any.jsx';
import Popup from './popup-base.jsx';
import Form from './form.jsx';
import Input from './input.jsx';
import A from './a.jsx';

class PopupFinish2fa extends Any {
	constructor(props) {
		super(props);
		this.setState({code2fa:""});
	}
	render(p,s,c,m) {
		return <Popup onClose={p.onClose}>
			<h1 className="h1-center mt-0">FINISH 2-FACTOR <br />AUTHENTICATION SETUP</h1>
			<p>
				<img
					src="img/set2fa-popup.png" width="65" height="105"
					style={{float:"left",marginRight:"18px",position:"relative",top:"-3px"}}
				/>
				Now, activate 2FA.
				<br /><br />
				Please enter the 6-digit code generated by the authentication app on your device to complete 2FA setup.
			</p>
			<Form onSubmit={this.onSubmit.bind(this)}>
				<Input
					type="text" placeholder="AUTHENTICATION CODE"
					hint={s.pending ? "Loading...": s.er ? s.er.message : "E.g. 123 456"}
					value={s.code2fa} onChange={(this.onCode.bind(this))}
					hasError={s.codeValid==false || s.er}
					checkValid={str=>(str+'').replace(/\D+/g, "").length==6} required
				/>
				<div className="d-flex flex-column align-items-center justify-content-center mt-4">
					<button type="submit"
						disabled={!s.codeValid || s.pending}
						className={[
							"btn btn-lg btn-primary", "mb-3",
							s.codeValid ? "" : " disabled",
						].join(" ")}
					>
						FINISH 2FA SETUP
					</button>
					<A m={m} className="text-muted external" href="forgot2fa"><small>I’m not able to log in with 2FA</small></A>
				</div>
			</Form>
		</Popup>;
	}
	onCode(code2fa,codeValid) {
		this.setState({code2fa,codeValid,er:null}, ()=>{
			this.forceUpdate();
		});
	}
	onSubmit() {
		this.setState({pending:true});
		this.props.m.api.confirmTotpSecretKey(this.state.code2fa)
		.then(x=>{
			this.props.onClose();
		})
		.catch(er=>{
			this.setState({er,pending:false})
		})
		;
	}
}

export default PopupFinish2fa;
