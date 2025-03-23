import {IExecuteFunctions, INodeExecutionData} from 'n8n-workflow';
import {AxiosRequestConfig} from 'axios';

import {TemplateSender} from './TemplateSender';

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

	it('builds request for valid template', async () => {
		(context.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
			switch (name) {
				case 'templateId':
					return 'my-template';
				case 'group':
					return 'groupA';
				default:
					return '';
			}
		});

		const sender = new TemplateSender();
		const result = await sender.buildRequest(context as IExecuteFunctions, items);

		expect(result).toMatchObject<AxiosRequestConfig>({
			url: "/template/my-template?group=groupA",
		});
	});

	it('builds request for valid plugin without templateId', async () => {
		(context.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
			switch (name) {
				case 'group':
					return 'groupA';
				default:
					return '';
			}
		});

		const sender = new TemplateSender();
		const result = await sender.buildRequest(context as IExecuteFunctions, items);

		expect(result).toMatchObject<AxiosRequestConfig>({
			url: "/template/?group=groupA",
		});
	});

	it('builds request for valid plugin without group', async () => {
		(context.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
			switch (name) {
				case 'templateId':
					return 'my-template';
				default:
					return '';
			}
		});

		const sender = new TemplateSender();
		const result = await sender.buildRequest(context as IExecuteFunctions, items);

		expect(result).toMatchObject<AxiosRequestConfig>({
			url: "/template/my-template?group=",
		});
	});
});
