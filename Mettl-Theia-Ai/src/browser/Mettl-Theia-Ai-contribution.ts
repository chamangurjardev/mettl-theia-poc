import {Command, CommandContribution, CommandRegistry} from '@theia/core/lib/common';
import {inject, injectable} from '@theia/core/shared/inversify';
import {HelloBackendService, HelloBackendWithClientService, MettlTheiaAiBackendService} from '../common/protocol';

const SayHelloViaBackendCommandWithCallBack: Command = {
    id: 'sayHelloOnBackendWithCallBack.command',
    label: 'Say hello on the backend with a callback to the client',
};

const SayHelloViaBackendCommand: Command = {
    id: 'sayHelloOnBackend.command',
    label: 'Say hello on the backend',
};

const AskYourQueryWithMettlTheiAi: Command = {
    id: 'askYourQueryWithMettlTheiAi.command',
    label: 'Ask your query with mettl thei ai',
};

@injectable()
export class MettlTheiaAiCommandContribution implements CommandContribution {

    constructor(
        @inject(HelloBackendWithClientService) private readonly helloBackendWithClientService: HelloBackendWithClientService,
        @inject(HelloBackendService) private readonly helloBackendService: HelloBackendService,
        @inject(MettlTheiaAiBackendService) private readonly mettlTheiaAiBackendService: MettlTheiaAiBackendService,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(SayHelloViaBackendCommandWithCallBack, {
            execute: () => this.helloBackendWithClientService.greet().then(r => console.log(r))
        });
        registry.registerCommand(SayHelloViaBackendCommand, {
            execute: () => this.helloBackendService.sayHelloTo('World').then(r => console.log(r))
        });

        registry.registerCommand(AskYourQueryWithMettlTheiAi, {
            execute: () =>
                this.mettlTheiaAiBackendService.getChatGPTResponse("Write binary search in java")
                    .then(r => console.log(r))
                    .catch(e => console.error("Error in chat gpt communication :: ", e))
        });
    }
}
