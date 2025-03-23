import {IExecuteFunctions, INodeExecutionData, NodeOperationError} from 'n8n-workflow';
import {AxiosRequestConfig} from 'axios';

import {PluginSender} from './PluginSender';

describe('PluginSender', () => {
	let context: Partial<IExecuteFunctions>;
	let items: INodeExecutionData[];

	beforeEach(() => {
		context = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({peerApiDomain: 'https://example.com'}),
			getNode: jest.fn((): any => ({name: 'TestNode'})),
		};
		items = [];
	});

	it('builds request for valid plugin with text plugin', async () => {
		(context.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
			switch (name) {
				case 'plugins':
					return 'text';
				case 'textFormat':
					return 'markdown';
				case 'group':
					return 'groupA';
				default:
					return '';
			}
		});

		const sender = new PluginSender();
		const result = await sender.buildRequest(context as IExecuteFunctions, items);

		expect(result).toMatchObject<AxiosRequestConfig>({
			url: "/callback?plugins=text&text.format=markdown&group=groupA",
		});
	});

	it('throws NodeOperationError on invalid plugin', async () => {
		(context.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
			switch (name) {
				case 'plugins':
					return 'invalid';
				default:
					return '';
			}
		});

		const sender = new PluginSender();

		await expect(
			sender.buildRequest(context as IExecuteFunctions, items),
		).rejects.toThrow(NodeOperationError);
	});

	it('builds request for valid plugin without textFormat', async () => {
		(context.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
			switch (name) {
				case 'plugins':
					return 'text';
				case 'group':
					return 'groupA';
				default:
					return '';
			}
		});

		const sender = new PluginSender();
		const result = await sender.buildRequest(context as IExecuteFunctions, items);

		expect(result).toMatchObject<AxiosRequestConfig>({
			url: "/callback?plugins=text&text.format=&group=groupA",
		});
	});

	it('builds request for valid plugin without group', async () => {
		(context.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
			switch (name) {
				case 'plugins':
					return 'text';
				case 'textFormat':
					return 'markdown';
				default:
					return '';
			}
		});

		const sender = new PluginSender();
		const result = await sender.buildRequest(context as IExecuteFunctions, items);

		expect(result).toMatchObject<AxiosRequestConfig>({
			url: "/callback?plugins=text&text.format=markdown&group=",
		});
	});
});
