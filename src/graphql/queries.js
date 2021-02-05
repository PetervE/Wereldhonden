/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getApplicant = /* GraphQL */ `
  query GetApplicant($id: ID!) {
    getApplicant(id: $id) {
      id
      name
      phone
      email
      choices {
        items {
          id
          liked
          applicantId
          dogId
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listApplicants = /* GraphQL */ `
  query ListApplicants(
    $filter: ModelApplicantFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplicants(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        phone
        email
        choices {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getChoice = /* GraphQL */ `
  query GetChoice($id: ID!) {
    getChoice(id: $id) {
      id
      liked
      applicantId
      applicant {
        id
        name
        phone
        email
        choices {
          nextToken
        }
        createdAt
        updatedAt
      }
      dogId
      dog {
        id
        titel
        status
        geslacht
        gesteriliseerd
        gecastreerd
        huidige_verblijfplaats
        land_van_herkomst
        leeftijd
        type
        schofthoogte
        vergoeding
        bijzonderheden
        opmerking
        verhaal
        karakter
        fotos
        videos
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listChoices = /* GraphQL */ `
  query ListChoices(
    $filter: ModelChoiceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChoices(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        liked
        applicantId
        applicant {
          id
          name
          phone
          email
          createdAt
          updatedAt
        }
        dogId
        dog {
          id
          titel
          status
          geslacht
          gesteriliseerd
          gecastreerd
          huidige_verblijfplaats
          land_van_herkomst
          leeftijd
          type
          schofthoogte
          vergoeding
          bijzonderheden
          opmerking
          verhaal
          karakter
          fotos
          videos
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDog = /* GraphQL */ `
  query GetDog($id: ID!) {
    getDog(id: $id) {
      id
      titel
      status
      geslacht
      gesteriliseerd
      gecastreerd
      huidige_verblijfplaats
      land_van_herkomst
      leeftijd
      type
      schofthoogte
      vergoeding
      bijzonderheden
      opmerking
      verhaal
      karakter
      fotos
      videos
      createdAt
      updatedAt
    }
  }
`;
export const listDogs = /* GraphQL */ `
  query ListDogs(
    $filter: ModelDogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        titel
        status
        geslacht
        gesteriliseerd
        gecastreerd
        huidige_verblijfplaats
        land_van_herkomst
        leeftijd
        type
        schofthoogte
        vergoeding
        bijzonderheden
        opmerking
        verhaal
        karakter
        fotos
        videos
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
