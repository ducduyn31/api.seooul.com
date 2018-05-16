import Role from '../utils/role';

export default {
    'Admin': new Role('Admin', 4),
    'Moderator': new Role('Moderator', 3),
    'Writer': new Role('Writer', 2),
    'User': new Role('User', 1),
    'Guest': new Role('Guest', 0)
}
