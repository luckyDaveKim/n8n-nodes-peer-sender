import {IExecuteFunctions, INodeExecutionData} from 'n8n-workflow';
import {AxiosRequestConfig} from 'axios';

import {PluginTextSender} from './PluginTextSender';

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

	it('builds request for valid plugin', async () => {
		(context.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
			switch (name) {
				case 'textFormat':
					return 'markdown';
				case 'group':
					return 'groupA';
				default:
					return '';
			}
		});

		const sender = new PluginTextSender();
		const result = await sender.buildRequest(context as IExecuteFunctions, items);

		expect(result).toMatchObject<AxiosRequestConfig>({
			url: "/callback?plugins=text&text.format=markdown&group=groupA",
		});
	});

	it('builds request for valid plugin without textFormat', async () => {
		(context.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
			switch (name) {
				case 'group':
					return 'groupA';
				default:
					return '';
			}
		});

		const sender = new PluginTextSender();
		const result = await sender.buildRequest(context as IExecuteFunctions, items);

		expect(result).toMatchObject<AxiosRequestConfig>({
			url: "/callback?plugins=text&text.format=&group=groupA",
		});
	});

	it('builds request for valid plugin without group', async () => {
		(context.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
			switch (name) {
				case 'textFormat':
					return 'markdown';
				default:
					return '';
			}
		});

		const sender = new PluginTextSender();
		const result = await sender.buildRequest(context as IExecuteFunctions, items);

		expect(result).toMatchObject<AxiosRequestConfig>({
			url: "/callback?plugins=text&text.format=markdown&group=",
		});
	});
});
