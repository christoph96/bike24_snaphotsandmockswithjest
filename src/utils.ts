import { v4 as uuid } from 'uuid'

export type SomeData = {
    id?: string
    label: string
    amount: number
}

export const crunchSomeData = (data: SomeData): SomeData => {
    const { label, amount } = data

    if (amount === 0) {
        throw new Error('This amount is not acceptable. Choose another one.')
    }

    return {
        id: uuid(),
        amount,
        label,
    }
}

export const processCallback = (callback: Function) => {
    return callback()
}

export const doSideEffectsOrExpensiveStuff = async () => {
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts')

        return await res.json()
    } catch {
        throw new Error('Something isnt working right.')
    }
}
