import { INodeProperties } from 'n8n-workflow';

const defaultProperties: INodeProperties[] = [
	{
		displayName: 'Send Mode',
		name: 'sendMode',
		type: 'options',
		options: [
			{
				name: 'Plugin',
				value: 'plugin',
			},
			{
				name: 'Template',
				value: 'template',
			},
		],
		default: 'plugin',
	},
];

const _pluginText: INodeProperties[] = [
	{
		displayName: 'Text Format',
		name: 'textFormat',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				sendMode: ['plugin'],
				plugins: ['text'],
			},
		},
	},
];

// When the resource `plugin` is selected, this `operation` parameter will be shown.
export const sendModePlugin: INodeProperties[] = [
	{
		displayName: 'Plugins',
		name: 'plugins',
		type: 'options',
		options: [
			// TODO : Add all plugins
			// {
			// 	name: 'Deploy',
			// 	value: 'deploy',
			// },
			// {
			// 	name: 'ES',
			// 	value: 'es',
			// },
			// {
			// 	name: 'GrafanaHook',
			// 	value: 'grafanaHook',
			// },
			// {
			// 	name: 'HPA',
			// 	value: 'hpa',
			// },
			// {
			// 	name: 'Jenkins',
			// 	value: 'jenkins',
			// },
			// {
			// 	name: 'List',
			// 	value: 'list',
			// },
			// {
			// 	name: 'NpotHook',
			// 	value: 'npotHook',
			// },
			// {
			// 	name: 'PinpointHook',
			// 	value: 'pinpointHook',
			// },
			// {
			// 	name: 'Ranking',
			// 	value: 'ranking',
			// },
			// {
			// 	name: 'Screenshot',
			// 	value: 'screenshot',
			// },
			{
				name: 'Text',
				value: 'text',
			}
		],
		default: 'text',
		displayOptions: {
			show: {
				sendMode: ['plugin'],
			},
		},
	},
	..._pluginText,
];

// When the resource `template` is selected, this `operation` parameter will be shown.
export const sendModeTemplate: INodeProperties[] = [
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				sendMode: ['template'],
			},
		},
	}
];

export const peerFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                              defaultProperties                             */
	/* -------------------------------------------------------------------------- */
	...defaultProperties,

	/* -------------------------------------------------------------------------- */
	/*                              sendMode:plugin                               */
	/* -------------------------------------------------------------------------- */
	...sendModePlugin,

	/* -------------------------------------------------------------------------- */
	/*                              sendMode:template                             */
	/* -------------------------------------------------------------------------- */
	...sendModeTemplate,

	{
		displayName: 'Group',
		name: 'group',
		type: 'string',
		default: '',
	},

	{
		displayName: 'Send Body',
		name: 'sendBody',
		type: 'boolean',
		default: false,
		noDataExpression: true,
		description: 'Whether the request has body or not',
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'json',
		default: '',
		displayOptions: {
			show: {
				sendBody: [true],
			},
		},
	},
];
