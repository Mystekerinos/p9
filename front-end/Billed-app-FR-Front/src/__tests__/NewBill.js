/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import BillsUI from "../views/BillsUI.js";

import store from "../__mocks__/store.js";
import userEvent from "@testing-library/user-event";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {
      /*const html = NewBillUI()
            document.body.innerHTML = html*/
      //to-do write assertion
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
      await waitFor(() => screen.getByTestId("icon-mail"));
      const windowIcon = screen.getByTestId("icon-mail");
      //to-do write expect expression
      const iconActivated = windowIcon.classList.contains("active-icon");
      expect(iconActivated).toBeTruthy();
    });
  });
});

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then check if a document is selected", async () => {
      /*const html = NewBillUI()
            document.body.innerHTML = html*/
      //to-do write assertion
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
      await waitFor(() => screen.getByTestId("file"));
      const windowIcon = screen.getByTestId("file");
      //to-do write expect expression
      const fileSelected = windowIcon.classList.contains("error-message");
      expect(!fileSelected).toBeTruthy();
    });
  });
});

describe("When I select an image in a correct format", () => {
  test("Then the input file should display the file name", () => {
    //page NewBill
    const html = NewBillUI();
    document.body.innerHTML = html;
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    // initialisation NewBill
    const newBill = new NewBill({
      document,
      onNavigate,
      store,
      localStorage: window.localStorage,
    });
    const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
    const input = screen.getByTestId("file");
    input.addEventListener("change", handleChangeFile);
    //fichier au bon format
    fireEvent.change(input, {
      target: {
        files: [
          new File(["image.png"], "image.png", {
            type: "image/png",
          }),
        ],
      },
    });
    expect(handleChangeFile).toHaveBeenCalled();
    expect(input.files[0].name).toBe("image.png");
  });
  test("Then a bill is created", () => {
    //page NewBill
    const html = NewBillUI();
    document.body.innerHTML = html;
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    // initialisation NewBill
    const newBill = new NewBill({
      document,
      onNavigate,
      store: null,
      localStorage: window.localStorage,
    });
    //fonctionnalité submit
    const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
    const submit = screen.getByTestId("form-new-bill");
    submit.addEventListener("submit", handleSubmit);
    fireEvent.submit(submit);
    expect(handleSubmit).toHaveBeenCalled();
  });
});
describe("When I select a file with an incorrect extension", () => {
  test("Then the bill is deleted", () => {
    //page NewBill
    const html = NewBillUI();
    document.body.innerHTML = html;
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    // initialisation NewBill
    const newBill = new NewBill({
      document,
      onNavigate,
      store: null,
      localStorage: window.localStorage,
    });
    // fonctionnalité séléction fichier
    const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
    const input = screen.getByTestId("file");
    input.addEventListener("change", handleChangeFile);
    //fichier au mauvais format
    fireEvent.change(input, {
      target: {
        files: [
          new File(["image.txt"], "image.txt", {
            type: "image/txt",
          }),
        ],
      },
    });
    expect(handleChangeFile).toHaveBeenCalled();
    expect(input.files[0].name).toBe("image.txt");

    // Vérifier si l'élément 'error-message' affiche le texte attendu
    const errorMessage = screen.getByTestId("error-message");
    expect(errorMessage.textContent).toBe(
      "L'extension du fichier n'est pas valide. Veuillez sélectionner un fichier au format jpg, jpeg ou png."
    );
  });
});
test("Then it fails with a 404 message error", async () => {
  const html = BillsUI({ error: "Erreur 404" });
  document.body.innerHTML = html;
  const message = await screen.getByText(/Erreur 404/);
  expect(message).toBeTruthy();
});
test("Then it fails with a 500 message error", async () => {
  const html = BillsUI({ error: "Erreur 500" });
  document.body.innerHTML = html;
  const message = await screen.getByText(/Erreur 500/);
  expect(message).toBeTruthy();
});
