/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateApplicant = /* GraphQL */ `
  subscription OnCreateApplicant {
    onCreateApplicant {
      id
      name
      phone
      email
      choices {
        items {
          id
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
export const onUpdateApplicant = /* GraphQL */ `
  subscription OnUpdateApplicant {
    onUpdateApplicant {
      id
      name
      phone
      email
      choices {
        items {
          id
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
export const onDeleteApplicant = /* GraphQL */ `
  subscription OnDeleteApplicant {
    onDeleteApplicant {
      id
      name
      phone
      email
      choices {
        items {
          id
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
export const onCreateChoice = /* GraphQL */ `
  subscription OnCreateChoice {
    onCreateChoice {
      id
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
        index
        titel
        status
        geslacht
        gesteriliseerd
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
export const onUpdateChoice = /* GraphQL */ `
  subscription OnUpdateChoice {
    onUpdateChoice {
      id
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
        index
        titel
        status
        geslacht
        gesteriliseerd
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
export const onDeleteChoice = /* GraphQL */ `
  subscription OnDeleteChoice {
    onDeleteChoice {
      id
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
        index
        titel
        status
        geslacht
        gesteriliseerd
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
export const onCreateDog = /* GraphQL */ `
  subscription OnCreateDog {
    onCreateDog {
      id
      index
      titel
      status
      geslacht
      gesteriliseerd
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
export const onUpdateDog = /* GraphQL */ `
  subscription OnUpdateDog {
    onUpdateDog {
      id
      index
      titel
      status
      geslacht
      gesteriliseerd
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
export const onDeleteDog = /* GraphQL */ `
  subscription OnDeleteDog {
    onDeleteDog {
      id
      index
      titel
      status
      geslacht
      gesteriliseerd
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
