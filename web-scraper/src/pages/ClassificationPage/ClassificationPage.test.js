import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import ClassificationPage from './ClassificationPage';

describe('ClassificationPage', () => {
    test('displays classification result when available', () => {
        const classificationData = 'Your classification: Expert';

        render(
            <MemoryRouter initialEntries={[{ pathname: '/classification', state: { classification: classificationData } }]}>
                <Route path="/classification" component={ClassificationPage} />
            </MemoryRouter>
        );

        expect(screen.getByText('User Classification')).toBeInTheDocument();
        expect(screen.getByText('Your classification results:')).toBeInTheDocument();
        expect(screen.getByText(classificationData)).toBeInTheDocument();
    });

    test('displays message when no classification data is available', () => {
        render(
            <MemoryRouter initialEntries={[{ pathname: '/classification', state: {} }]}>
                <Route path="/classification" component={ClassificationPage} />
            </MemoryRouter>
        );

        expect(screen.getByText('No classification data available.')).toBeInTheDocument();
    });

    test('navigates back to questions page', () => {
        const navigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);

        render(
            <MemoryRouter initialEntries={[{ pathname: '/classification', state: { classification: 'Some classification' } }]}>
                <Route path="/classification" component={ClassificationPage} />
            </MemoryRouter>
        );

        // Click the "Back to Questions" button
        screen.getByText('Back to Questions').click();
        expect(navigate).toHaveBeenCalledWith('/questions');
    });

    test('navigates to enter a new link page', () => {
        const navigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);

        render(
            <MemoryRouter initialEntries={[{ pathname: '/classification', state: { classification: 'Some classification' } }]}>
                <Route path="/classification" component={ClassificationPage} />
            </MemoryRouter>
        );

        // Click the "Enter a new Link!" button
        screen.getByText('Enter a new Link!').click();
        expect(navigate).toHaveBeenCalledWith('/');
    });
});
