import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import QuestionPage from './QuestionPage';

const mockStore = configureStore([]);

describe('QuestionPage', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            user: {
                themes: ['Theme1', 'Theme2'],
            },
        });

        // Mock global fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ questions: ['Question 1', 'Question 2'] }),
            })
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('fetches and displays questions based on themes', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <QuestionPage />
                </MemoryRouter>
            </Provider>
        );

        // Check if loading message is displayed initially
        expect(screen.getByText('Loading questions...')).toBeInTheDocument();

        // Wait for questions to be displayed
        await screen.findByText('Question 1');
        expect(screen.getByText('Question 2')).toBeInTheDocument();
    });

    test('submits answers and navigates to classification', async () => {
        const navigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <QuestionPage />
                </MemoryRouter>
            </Provider>
        );

        // Wait for questions to be displayed
        await screen.findByText('Question 1');

        // Select an answer for the first question
        fireEvent.click(screen.getByLabelText('Yes'));

        // Mock fetch for classification submission
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ classification: 'Some classification' }),
            })
        );

        fireEvent.click(screen.getByText('Submit Answers'));
        await waitFor(() => expect(navigate).toHaveBeenCalledWith('/classification', expect.anything()));
    });
});
