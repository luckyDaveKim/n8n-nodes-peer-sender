import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PeerSenderCredentialsApi implements ICredentialType {
	name = 'peerSenderApi';
	displayName = 'PeerSender API';
	properties: INodeProperties[] = [
		{
			displayName: 'PEER API Domain',
			name: 'peerApiDomain',
			type: 'string',
			default: 'http://example.com',
		},
	];

	// This credential is currently not used by any node directly
	// but the HTTP Request node can use it to make requests.
	// The credential is also testable due to the `test` property below
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.peerApiDomain}}',
			url: '/monitor/l7check',
		},
	};
}
