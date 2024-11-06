import { expect } from 'chai'
import pkg from 'pactum'
import { baseUrl, userName, password, userId, isbn } from '../helpers/data.js'

const { spec } = pkg
let token_response

describe('API tests', () => {
  it('should get request', async () => {
    const response = await spec().get(`${baseUrl}/BookStore/v1/Books`)
    const responseB = JSON.stringify(response.body)

    expect(response.statusCode).to.eql(200)
    expect(response.body.books[1].title).to.eql(
      'Learning JavaScript Design Patterns',
    )
    expect(response.body.books[4].author).to.eql('Kyle Simpson')
    expect(response.body.books).to.be.an('array')
    expect(response.body.books.length).to.eql(8)
    expect(responseB).to.include('Learning JavaScript Design Pattern')
  })

  it.skip('should create a user', async () => {
    const response = await spec().post(`${baseUrl}/Account/v1/User`).withBody({
      userName,
      password,
    })

    expect(response.statusCode).to.eql(201)
  })

  it('should generate token', async () => {
    const response = await spec()
      .post(`${baseUrl}/Account/v1/GenerateToken`)
      .withBody({
        userName,
        password,
      })
    token_response = response.body.token

    expect(response.statusCode).to.eql(200)
    expect(response.body.result).to.eql('User authorized successfully.')
  })

  it('should add book', async () => {
    const response = await spec()
      .post(`${baseUrl}/BookStore/v1/Books`)
      .withBody({
        userId,
        collectionOfIsbns: [
          {
            isbn,
          },
        ],
      })
      .withBearerToken(token_response)

    expect(response.statusCode).to.eql(201)
  })

  it("should check if book is added to user's collection", async () => {
    const response = await spec()
      .get(`${baseUrl}/Account/v1/User/${userId}`)
      .withBearerToken(token_response)

    expect(response.statusCode).to.eql(200)
  })

  it('should delete all books', async () => {
    const response = await spec()
      .delete(`${baseUrl}/BookStore/v1/Books?UserId=${userId}`)
      .withBearerToken(token_response)

    expect(response.statusCode).to.eql(204)
  })

  it('should ensure that list is empty', async () => {
    const response = await spec()
      .get(`${baseUrl}/Account/v1/User/${userId}`)
      .withBearerToken(token_response)

    expect(response.statusCode).to.eql(200)
    expect(response.body.books.length).to.eql(0)
  })
})
