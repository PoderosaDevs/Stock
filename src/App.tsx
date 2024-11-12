import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "./Routes"
import { ApolloProvider } from "@apollo/client"
import { client } from "./services/conection"

function App() {
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
          <AppRoutes />
      </ApolloProvider>
    </BrowserRouter>
  )
}

export default App
