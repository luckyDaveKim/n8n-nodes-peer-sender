import {PeerSender} from './PeerSender.node'; // 실제 클래스 경로에 맞게 수정
import {PluginSender} from './modes/PluginSender';
import {IExecuteFunctions, INodeExecutionData, NodeOperationError} from 'n8n-workflow';
import axios from 'axios';

jest.mock('axios');
jest.mock('./modes/PluginSender');
jest.mock('./modes/TemplateSender');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PeerSender Node - execute()', () => {
	let context: Partial<IExecuteFunctions>;
	let items: INodeExecutionData[];

	beforeEach(() => {
		items = [{json: {foo: 'bar'}}];

		context = {
			getInputData: () => items,
			getNodeParameter: jest.fn((name: string) => {
				const params: Record<string, any> = {
					sendMode: 'plugin',
					sendBody: false,
				};
				return params[name];
			}),
			getCredentials: jest.fn().mockResolvedValue({peerApiDomain: 'https://example.com'}),
			getNode: jest.fn((): any => ({name: 'PeerSenderNode'})),
		};
	});

	it('should build request and call axios for plugin mode', async () => {
		const mockBuildRequest = jest.fn().mockResolvedValue({
			url: '/callback/test',
			method: 'POST',
		});

		// mock PluginSender with buildRequest
		(PluginSender as jest.Mock).mockImplementation(() => ({
			buildRequest: mockBuildRequest,
		}));

		mockedAxios.request.mockResolvedValueOnce({data: {result: 'ok'}});

		const node = new PeerSender();
		const result = await node.execute.call(context as IExecuteFunctions);

		expect(mockBuildRequest).toHaveBeenCalled();
		expect(mockedAxios.request).toHaveBeenCalledWith({
			url: '/callback/test',
			method: 'POST',
			baseURL: 'https://example.com',
		});
		expect(result[0]).toContainEqual({result: 'ok'});
	});

	it('should parse and include body if sendBody is true', async () => {
		(context.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
			const params: Record<string, any> = {
				sendMode: 'plugin',
				sendBody: true,
				body: '{"msg":"hi"}',
			};
			return params[name];
		});

		const mockBuildRequest = jest.fn().mockResolvedValue({
			url: '/callback/with-body',
			method: 'POST',
		});

		(PluginSender as jest.Mock).mockImplementation(() => ({
			buildRequest: mockBuildRequest,
		}));

		mockedAxios.request.mockResolvedValueOnce({data: {sent: true}});

		const node = new PeerSender();
		const result = await node.execute.call(context as IExecuteFunctions);

		expect(mockedAxios.request).toHaveBeenCalledWith({
			url: '/callback/with-body',
			method: 'POST',
			baseURL: 'https://example.com',
			data: {msg: 'hi'},
		});
		expect(result[0]).toContainEqual({sent: true});
	});

	it('should throw NodeOperationError on axios failure', async () => {
		const mockBuildRequest = jest.fn().mockResolvedValue({
			url: '/fail',
			method: 'POST',
		});

		(PluginSender as jest.Mock).mockImplementation(() => ({
			buildRequest: mockBuildRequest,
		}));

		mockedAxios.request.mockRejectedValueOnce(new Error('Request failed'));

		const node = new PeerSender();

		await expect(node.execute.call(context as IExecuteFunctions)).rejects.toThrow(NodeOperationError);
	});
});
