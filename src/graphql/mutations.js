/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createApplicant = /* GraphQL */ `
  mutation CreateApplicant(
    $input: CreateApplicantInput!
    $condition: ModelApplicantConditionInput
  ) {
    createApplicant(input: $input, condition: $condition) {
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
export const updateApplicant = /* GraphQL */ `
  mutation UpdateApplicant(
    $input: UpdateApplicantInput!
    $condition: ModelApplicantConditionInput
  ) {
    updateApplicant(input: $input, condition: $condition) {
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
export const deleteApplicant = /* GraphQL */ `
  mutation DeleteApplicant(
    $input: DeleteApplicantInput!
    $condition: ModelApplicantConditionInput
  ) {
    deleteApplicant(input: $input, condition: $condition) {
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
export const createChoice = /* GraphQL */ `
  mutation CreateChoice(
    $input: CreateChoiceInput!
    $condition: ModelChoiceConditionInput
  ) {
    createChoice(input: $input, condition: $condition) {
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
export const updateChoice = /* GraphQL */ `
  mutation UpdateChoice(
    $input: UpdateChoiceInput!
    $condition: ModelChoiceConditionInput
  ) {
    updateChoice(input: $input, condition: $condition) {
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
export const deleteChoice = /* GraphQL */ `
  mutation DeleteChoice(
    $input: DeleteChoiceInput!
    $condition: ModelChoiceConditionInput
  ) {
    deleteChoice(input: $input, condition: $condition) {
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
export const createDog = /* GraphQL */ `
  mutation CreateDog(
    $input: CreateDogInput!
    $condition: ModelDogConditionInput
  ) {
    createDog(input: $input, condition: $condition) {
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
export const updateDog = /* GraphQL */ `
  mutation UpdateDog(
    $input: UpdateDogInput!
    $condition: ModelDogConditionInput
  ) {
    updateDog(input: $input, condition: $condition) {
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
export const deleteDog = /* GraphQL */ `
  mutation DeleteDog(
    $input: DeleteDogInput!
    $condition: ModelDogConditionInput
  ) {
    deleteDog(input: $input, condition: $condition) {
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
