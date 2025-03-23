import {IExecuteFunctions, INodeExecutionData} from 'n8n-workflow';
import {AxiosRequestConfig} from 'axios';

import {ISenderStrategy, Plugin} from '../types';

const PLUGIN: Plugin = 'text';

export class PluginTextSender implements ISenderStrategy {
	async buildRequest(
		context: IExecuteFunctions,
		items: INodeExecutionData[],
	): Promise<AxiosRequestConfig> {
		const textFormat = context.getNodeParameter('textFormat', 0, '') as string;
		const group = context.getNodeParameter('group', 0, '') as string;

		return {
			url: `/callback?plugins=${PLUGIN}&text.format=${textFormat}&group=${group}`,
		};
	}
}
