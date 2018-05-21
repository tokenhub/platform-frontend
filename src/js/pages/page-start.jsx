import React from 'react';
import T from '../tags.jsx';

import PageSignUp from './page-signup.jsx';
import PageVerifyEmail from './page-verify-email.jsx';
import PageSet2FA from './page-set2fa.jsx';
import PageSignIn from './page-signin.jsx';

class PageStart extends T.Page {
	constructor(props) {
		super(props);
        if (!props.m.auth) {
            props.m.api.getAuthData();
        }
	}
	render(p,s,c,m) {
		var auth = m && m.auth;
		// debugger;
		if (!auth) return <PageSignUp {...p} {...s} />;
		if (!auth.email) return <PageSignUp {...p} {...s} />;
		if (auth.emailVerified && m.path.contains["verify-email"]) {
			m.api.gotoHref(T.A.href({href:"/start"},m));
		}
		if (auth.signedIn) {
			m.api.gotoHref(T.A.href({href:"/"},m));
			return <div></div>;
		}
		if (!auth.emailVerified) return <PageVerifyEmail {...p} {...s} />;
		if (!auth.signedInEmail) return <PageSignIn {...p} {...s} />;
		if (!auth.totpSecretKeyConfirmed) return <PageSet2FA {...p} {...s} />;
		/*
		if (auth.canSignIn) return <PageSignIn {...p} {...s} />;
        // if (!auth.emailVerified) return <PageVerifyEmail {...p} {...s} />;
        if (!auth.emailVerified) {
			return <PageVerifyEmail {...p} {...s} />;
			if (auth.is2FAOn) {
				return <PageSet2FA {...p} {...s} />;
			} else if (auth.canSignIn) {
				return <PageSignIn {...p} {...s} />;
			} else {
				return <PageVerifyEmail {...p} {...s} />;
			}
		}
		if (!auth.totpSecretKeyConfirmed) return <PageSet2FA {...p} {...s} />;
		*/
    }
}

export default PageStart;
