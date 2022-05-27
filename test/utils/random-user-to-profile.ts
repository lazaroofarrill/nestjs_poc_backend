import { Profile } from '../../src/modules/profile/entities/profile.entity'

export function randomUserToProfile(u: any) {
  return {
    firstName: u.name.first,
    lastName: u.name.last,
    email: u.email,
    password: u.login.password,
    city: u.location.city,
    state: u.location.state,
    zipcode: u.location.postcode,
    address: `${u.location.street.number} ${u.location.street.name}`,
    img: u.picture.thumbnail,
  } as Profile
}
