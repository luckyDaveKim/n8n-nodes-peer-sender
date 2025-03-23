import {
	type IExecuteFunctions,
	type INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import {peerFields} from './PeerFieldDescription';
import axios from 'axios';

export class PeerSender implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PeerSender',
		name: 'peerSender',
		icon: 'file:peerSender.svg',
		group: ['transform'],
		version: 1,
		description: 'Peer sender node',
		defaults: {
			name: 'PeerSender',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'peerSenderApi',
				required: true,
			}
		],
		properties: [
			...peerFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		// credential info
		const credential = await this.getCredentials('peerSenderApi');
		const domain: string = credential.peerApiDomain as string;

		// parameter info
		const plugins: string = this.getNodeParameter('plugins', 0, '') as string;
		const textFormat: string = this.getNodeParameter('textFormat', 0, '') as string;
		const group: string = this.getNodeParameter('group', 0, '') as string;
		const sendBody: boolean = this.getNodeParameter('sendBody', 0, false) as boolean;
		const body: string = this.getNodeParameter('body', 0, '') as string;

		const url = `${domain}/callback?plugins=${plugins}&text.format=${textFormat}&group=${group}`;
		try {
			let response;
			if (sendBody) {
				response = await axios.post(url, JSON.parse(body));
			} else {
				response = await axios.post(url);
			}

			items.push(response.data);
		} catch (error) {
			throw new NodeOperationError(this.getNode(), error, {
				messageMapping: {
					url,
					error
				},
			});
		}

		return [items];
	}
}
