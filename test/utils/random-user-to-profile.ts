import axios from 'axios'
import { Profile } from '../../src/modules/profile/entities/profile.entity'

export async function randomUserToProfile(): Promise<Profile> {
  return axios
    .get('https://randomuser.me/api')
    .then((response) => {
      return response.data.results[0]
    })
    .then(
      (u) =>
        ({
          firstName: u.name.first,
          lastName: u.name.last,
          email: u.email,
          password: u.login.password,
          city: u.location.city,
          state: u.location.state,
          zipcode: u.location.postcode,
          address: `${u.location.street.number} ${u.location.street.name}`,
          img: u.picture.thumbnail,
        } as Profile),
    )
}
