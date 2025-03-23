import {ISenderStrategy} from '../types';
import {IExecuteFunctions, INodeExecutionData} from 'n8n-workflow';
import {AxiosRequestConfig} from 'axios';

export class TemplateSender implements ISenderStrategy {
	async buildRequest(
		context: IExecuteFunctions,
		items: INodeExecutionData[],
	): Promise<AxiosRequestConfig> {
		const templateId = context.getNodeParameter('templateId', 0, '') as string;
		const group = context.getNodeParameter('group', 0, '') as string;

		return {
			url: `/template/${templateId}?group=${group}`,
		};
	}
}
