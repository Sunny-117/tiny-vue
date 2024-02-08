import { effect, reactive } from '.';
import { it } from 'vitest'

const person = {
    firstName: 'fu',
    lastName: 'zhiqiang',
    get name() {
        return this.firstName + this.lastName;
    }
}

it('happy path', () => {
    const proxy = reactive(person);
    effect(() => {
        console.log('effect1', proxy.name)
    });
    effect(() => {
        console.log('effect2', proxy.name)
    });
    proxy.firstName = 'Sunny';
    const expectedLogs = [
        'effect1 fuzhiqiang',
        'effect2 fuzhiqiang',
        'effect1 Sunnyzhiqiang',
        'effect2 Sunnyzhiqiang'
    ];
})

