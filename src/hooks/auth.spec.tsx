import "jest-fetch-mock";
import { startAsync } from "expo-auth-session";
// import { mocked } from "ts-jest/utils";
import { mocked } from "ts-jest/dist/utils/testing";
import fetchMock from "jest-fetch-mock";
import { renderHook, act } from "@testing-library/react-hooks";
import { AuthProvider, useAuth } from "./auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("expo-auth-session");

fetchMock.enableMocks();

describe("Auth Hook", () => {
  // Limpar o async storage para não dar problema nos testes
  beforeEach(async () => {
    const userCollectionKey = "@gofinances:user";
    await AsyncStorage.removeItem(userCollectionKey);
  });

  it("should be able to sign in with Google account existing", async () => {
    //Primeiro, nós precisamos do Token. Então, vamos Mockar a função de startAsync.
    const googleMocked = mocked(startAsync as any);
    googleMocked.mockReturnValueOnce({
      type: "success",
      params: {
        access_token: "any_token",
      },
    });

    //Agora que temos o Token, vamos mockar a requisição http dos dados de profile do usuário.
    fetchMock.mockResponseOnce(
      JSON.stringify({
        id: "231231",
        email: "rodrigo.goncalves@rocketseat.team",
        given_name: "Rodrigo",
        picture: "any_photo.png",
      })
    );

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(async () => await result.current.signInWithGoogle());
    await waitForNextUpdate();

    // Você até pode usar esse console.log para visualizar os dados.
    console.log("USER PROFILE =>", result.current.user);

    expect(result.current.user.email).toBe("rodrigo.goncalves@rocketseat.team");
    expect(result.current.user).toBeTruthy();
  });

  it("user should not connect if cancel authentication with Google", async () => {
    const googleMocked = mocked(startAsync as any);
    googleMocked.mockReturnValueOnce({
      type: "cancel",
    });

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(async () => await result.current.signInWithGoogle());
    await waitForNextUpdate();

    console.log("tem usuario? ", result.current.user);

    expect(result.current.user).not.toHaveProperty("id");
  });

  it("should be error with incorrectly Google parameters", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    try {
      act(async () => await result.current.signInWithGoogle());
      await waitForNextUpdate();
    } catch (error) {
      expect(error).toThrowError();
    }

    expect(result.current.user).not.toHaveProperty("id");
  });
});
