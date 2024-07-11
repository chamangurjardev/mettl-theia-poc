import {ConnectionHandler, JsonRpcConnectionHandler} from '@theia/core';
import {ContainerModule} from '@theia/core/shared/inversify';
import {
    BackendClient,
    HELLO_BACKEND_PATH,
    HELLO_BACKEND_WITH_CLIENT_PATH,
    HelloBackendService,
    HelloBackendWithClientService,
    METTL_THEIA_SERVICE_BACKEND_PATH,
    MettlTheiaAiBackendService
} from '../common/protocol';
import {HelloBackendWithClientServiceImpl} from './hello-backend-with-client-service';
import {HelloBackendServiceImpl} from './hello-backend-service';
import {MettlTheiaAiExtensionServiceImpl} from "./mettl-theia-ai-extension-service-impl";

export default new ContainerModule(bind => {
    bind(HelloBackendService).to(HelloBackendServiceImpl).inSingletonScope()
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new JsonRpcConnectionHandler(HELLO_BACKEND_PATH, () => {
            return ctx.container.get<HelloBackendService>(HelloBackendService);
        })
    ).inSingletonScope();

    bind(HelloBackendWithClientService).to(HelloBackendWithClientServiceImpl).inSingletonScope()
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new JsonRpcConnectionHandler<BackendClient>(HELLO_BACKEND_WITH_CLIENT_PATH, client => {
            const server = ctx.container.get<HelloBackendWithClientServiceImpl>(HelloBackendWithClientService);
            server.setClient(client);
            client.onDidCloseConnection(() => server.dispose());
            return server;
        })
    ).inSingletonScope();


    bind(MettlTheiaAiBackendService).to(MettlTheiaAiExtensionServiceImpl).inSingletonScope()
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new JsonRpcConnectionHandler(METTL_THEIA_SERVICE_BACKEND_PATH, () => {
            return ctx.container.get<MettlTheiaAiBackendService>(MettlTheiaAiBackendService);
        })
    ).inSingletonScope();

});
