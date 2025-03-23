import {IExecuteFunctions, INodeExecutionData, NodeOperationError} from 'n8n-workflow';
import {AxiosRequestConfig} from 'axios';

import {ISenderStrategy, Plugin} from '../types';
import {PluginTextSender} from './PluginTextSender';

export class PluginSender implements ISenderStrategy {
	async buildRequest(
		context: IExecuteFunctions,
		items: INodeExecutionData[],
	): Promise<AxiosRequestConfig> {
		let sender: ISenderStrategy;
		const plugins: Plugin = context.getNodeParameter('plugins', 0, '') as Plugin;
		switch (plugins) {
			case 'text':
				sender = new PluginTextSender();
				break;
			default:
				throw new NodeOperationError(context.getNode(), `Invalid plugins; ${plugins} is not defined!`);
		}

		return sender.buildRequest(context, items);
	}
}
