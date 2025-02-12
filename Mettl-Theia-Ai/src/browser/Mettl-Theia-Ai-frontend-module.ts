import {CommandContribution} from '@theia/core';
import {WebSocketConnectionProvider} from '@theia/core/lib/browser';
import {ContainerModule, injectable} from '@theia/core/shared/inversify';
import {
    BackendClient,
    HELLO_BACKEND_PATH,
    HELLO_BACKEND_WITH_CLIENT_PATH,
    HelloBackendService,
    HelloBackendWithClientService, METTL_THEIA_SERVICE_BACKEND_PATH, MettlTheiaAiBackendService
} from '../common/protocol';
import {MettlTheiaAiCommandContribution} from './Mettl-Theia-Ai-contribution';
import {MettlTheiaAiExtensionServiceImpl} from "../node/mettl-theia-ai-extension-service-impl";

export default new ContainerModule(bind => {
    bind(CommandContribution).to(MettlTheiaAiCommandContribution).inSingletonScope();
    bind(BackendClient).to(BackendClientImpl).inSingletonScope();

    bind(HelloBackendService).toDynamicValue(ctx => {
        const connection = ctx.container.get(WebSocketConnectionProvider);
        return connection.createProxy<HelloBackendService>(HELLO_BACKEND_PATH);
    }).inSingletonScope();

    bind(HelloBackendWithClientService).toDynamicValue(ctx => {
        const connection = ctx.container.get(WebSocketConnectionProvider);
        const backendClient: BackendClient = ctx.container.get(BackendClient);
        return connection.createProxy<HelloBackendWithClientService>(HELLO_BACKEND_WITH_CLIENT_PATH, backendClient);
    }).inSingletonScope();

    bind(MettlTheiaAiBackendService).toDynamicValue(ctx => {
        const connection = ctx.container.get(WebSocketConnectionProvider);
        return connection.createProxy<MettlTheiaAiExtensionServiceImpl>(METTL_THEIA_SERVICE_BACKEND_PATH);
    }).inSingletonScope();
});

@injectable()
class BackendClientImpl implements BackendClient {
    getName(): Promise<string> {
        return new Promise(resolve => resolve('Client'));
    }

}
