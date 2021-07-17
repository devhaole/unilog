import { LogContext } from '../core';
import { createPlugin } from '../engine';
import { LogType } from '../shared';

export default createPlugin((options?: number) => {
    return {
        name: 'console',
        execute(ctx) {
            const content = ctx.log.content;
            const timestamp = getStrTimestamp(ctx);
            const type = getStrPrefixType(ctx);
            const namespaces = getStrNamespaces(ctx);

            printf(content, timestamp, type, namespaces);
        }
    }
});

function printf(content: unknown[], timestamp: string, type: string, namespaces: string): void {
    const metadata = timestamp + type + namespaces;

    if (typeof content[0] == 'string') {
        content[0] = metadata + ' ' + content[0];
    }
    else {
        content.unshift(metadata);
    }
}

function getStrPrefixType(ctx: LogContext): string {
    switch (ctx.log.type) {
        case LogType.Info: return '[info]';
        case LogType.Warning: return '[warn]';
        case LogType.Error: return '[error]';
        case LogType.Verbose: return '[debug]';

        default: throw new Error('Log type in invalid');
    }
}

function getStrTimestamp(ctx: LogContext): string {
    return '[' + ctx.log.timestamp.toISO() + ']';
}

function getStrNamespaces(ctx: LogContext): string {
    const str = ctx.log.namespaces
        .map(n => n.value.trim())
        .join('.');

    return '[' + str + ']';
}