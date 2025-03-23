import {
	type IExecuteFunctions,
	type INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import axios from 'axios';

import {peerFields} from './PeerFieldDescription';
import {ISenderStrategy, SendMode} from './types';
import {PluginSender} from './modes/PluginSender';
import {TemplateSender} from './modes/TemplateSender';

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

		let sender: ISenderStrategy;
		const sendMode: SendMode = this.getNodeParameter('sendMode', 0, 'plugin') as SendMode;
		switch (sendMode) {
			case 'plugin':
				sender = new PluginSender();
				break;
			case 'template':
				sender = new TemplateSender();
				break;
			default:
				throw new NodeOperationError(this.getNode(), `Invalid send mode; ${sendMode} is not defined!`);
		}
		const axiosRequest = await sender.buildRequest(this, items);

		// set base url
		const credential = await this.getCredentials('peerSenderApi');
		axiosRequest.baseURL = credential.peerApiDomain as string;

		// set body
		const sendBody: boolean = this.getNodeParameter('sendBody', 0, false) as boolean;
		if (sendBody) {
			const body: string = this.getNodeParameter('body', 0, '') as string;
			axiosRequest.data = JSON.parse(body);
		}

		// request axios
		try {
			const response = await axios.request(axiosRequest);
			items.push(response.data);
		} catch (error) {
			throw new NodeOperationError(this.getNode(), error, {
				messageMapping: {
					baseUrl: axiosRequest.baseURL || '',
					url: axiosRequest.url || '',
					method: axiosRequest.method || '',
				},
			});
		}

		return [items];
	}
}
