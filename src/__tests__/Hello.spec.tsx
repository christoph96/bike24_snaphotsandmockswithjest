import React from 'react'
import renderer from 'react-test-renderer'
import Hello from '../Hello'
import {
    crunchSomeData,
    doSideEffectsOrExpensiveStuff,
    processCallback,
    SomeData,
} from '../utils'

// We created a manual mock. The __mocks__ directory adjacent to the module defines the default mocks
// to be used in case the module is mocked.
// jest.mock('../utils')

// We mock only a specific method from the ../utils module
// jest.mock('../utils', () => {
//     const originalModule = jest.requireActual('../utils')

//     return {
//         __esModule: true,
//         ...originalModule,
//         doSideEffectsOrExpensiveStuff: () => [],
//     }
// })

describe('snapshot tests', () => {
    it.skip('should render component', () => {
        const tree = renderer.create(<Hello />).toJSON()

        expect(tree).toMatchSnapshot()
    })

    it.skip('should render component inline', () => {
        const tree = renderer.create(<Hello />).toJSON()

        expect(tree).toMatchInlineSnapshot()
    })

    it.skip('should throw an error if amount is 0', () => {
        const invalidData: SomeData = {
            label: 'some label',
            amount: 0,
        }

        expect(() =>
            crunchSomeData(invalidData)
        ).toThrowErrorMatchingInlineSnapshot()
    })

    it.skip('should return a random ID on the data object', () => {
        const validData: SomeData = {
            label: 'some label',
            amount: 1,
        }

        const data = crunchSomeData(validData)

        // This is a property matcher. It specifies flexibilities on the snapshot.
        // { id: expect.any(String) },
        expect(data).toMatchInlineSnapshot()
    })
})

describe('demonstrate jest mocking capabilities', () => {
    // Restore the implementation of all mock functions under
    // jests control to their original implementation.
    // beforeEach(() => {
    //     jest.restoreAllMocks()
    // })

    it.skip('should demonstrate a mock function', () => {
        const mockCallback = jest.fn(() => 123)
        // Show different utilities of a mock function in jest

        const res = processCallback(mockCallback)

        expect(mockCallback).toHaveBeenCalledTimes(1)
        expect(res).toEqual(123)
    })

    // We store the actual implementation of fetch somewhere to reassign it later when we restore the mock.
    const unmockedFetch = global.fetch
    it.skip('should mock the global fetch API manually', async () => {
        // fetch API is mocked in the upcoming calls by manually assigning it.
        const mockedFetch = jest.fn(async () =>
            Promise.resolve({
                json: () => Promise.resolve({ ok: true }),
            })
        )
        global.fetch = mockedFetch

        const res = await doSideEffectsOrExpensiveStuff()

        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(res).toMatchObject({ ok: true })

        // We need to reset our mocks at the begining / end of each test
        // Jest exposes utilities like "mockReset", "mockRestore" and "mockClear" for a mock function.
        // Here we re-implement the actual implementation.

        global.fetch = unmockedFetch
    })

    it.skip('should show the jest spyOn way to mock a objects method', async () => {
        const fetchMock = jest
            .spyOn(global, 'fetch')
            .mockImplementation(() =>
                Promise.resolve({ json: () => Promise.resolve([]) })
            )

        const res = await doSideEffectsOrExpensiveStuff()

        expect(fetchMock).toHaveBeenCalledWith(
            'https://jsonplaceholder.typicode.com/posts'
        )

        expect(res).toHaveLength(0)
    })

    // We need to restore original implementations on the global jest object.
    it.skip('should call the real original fetch API when all mocks have been restored.', async () => {
        const res = await doSideEffectsOrExpensiveStuff()

        expect(res).toHaveLength(100)
    })

    it.skip('should demonstrate module mocks.', async () => {
        const res = await doSideEffectsOrExpensiveStuff()

        expect(res).toHaveLength(0)
    })
    it.skip('should demonstrate manual module mocks.', async () => {
        const res = await doSideEffectsOrExpensiveStuff()

        expect(processCallback).toBeUndefined()
        expect(res).toHaveLength(1)
    })
})

// Sources:
// https://divotion.com/blog/auto-reset-mocks-restore-spies-in-jest
// https://benjaminjohnson.me/mocking-fetch
// https://jestjs.io/docs
