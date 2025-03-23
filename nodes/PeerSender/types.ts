import {IExecuteFunctions, INodeExecutionData} from 'n8n-workflow';
import {AxiosRequestConfig} from 'axios';

export interface ISenderStrategy {
	buildRequest(
		context: IExecuteFunctions,
		items: INodeExecutionData[],
	): Promise<AxiosRequestConfig>;
}

export type SendMode = 'plugin' | 'template';
export type Plugin =
	'deploy'
	| 'es'
	| 'grafanaHook'
	| 'hpa'
	| 'jenkins'
	| 'list'
	| 'npotHook'
	| 'pinpointHook'
	| 'ranking'
	| 'screenshot'
	| 'text';
