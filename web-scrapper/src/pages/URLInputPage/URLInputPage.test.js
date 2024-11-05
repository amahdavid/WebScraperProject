import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import URLInputPage from "./URLInputPage";

const mockStore = configureStore([]);

test("submits URL correctly", async () => {
  const store = mockStore({
    user: {
      url: "",
      themes: [],
      responses: [],
      loading: false,
      error: null,
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <URLInputPage />
      </MemoryRouter>
    </Provider>
  );

  const input = screen.getByPlaceholderText("Enter URL");
  fireEvent.change(input, { target: { value: "http://example.com" } });
  fireEvent.click(screen.getByText("Submit"));

  const actions = store.getActions();
  expect(actions).toEqual([
    { type: "user/setUrl", payload: "http://example.com" },
  ]);
});
