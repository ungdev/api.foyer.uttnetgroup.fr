const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const axios = require('axios')

module.exports = app => {
  app.get('/assos', [isAuth('assos')])
  app.get('/assos', async (req, res) => {
    try {
      const result = await axios.get(
        `${process.env.ETU_BASEURL}/api/private/user/organizations`,
        {
          headers: { Authorization: `Bearer ${req.user.access_token}` }
        }
      )
      let assos = result.data.data.map(asso => {
        return {
          login: asso._embed.organization,
          role: asso.role,
          permissions: asso.permissions,
          link: asso._links.find(l => l.rel === 'member.organization').uri
        }
      })
      assos = await Promise.all(
        assos.map(async asso => {
          let result2 = null
          try {
            result2 = await axios.get(
              `${process.env.ETU_BASEURL}${asso.link}`,
              {
                headers: { Authorization: `Bearer ${req.user.access_token}` }
              }
            )
            const { data } = result2.data
            return {
              ...asso,
              name: data.name,
              website: data.website,
              phone: data.phone,
              image: data._links.find(l => l.rel === 'orga.image').uri,
              mail: data.mail,
              description: data.description,
              descriptionShort: data.descriptionShort,
              members: formatMembers(data._embed.members)
            }
          } catch (e) {
            console.log('FAILED', asso.login, e)
          }

          return asso
        })
      )
      return res
        .status(200)
        .json(assos)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}

formatMembers = members => {
  return members.map(member => {
    const { user } = member._embed
    delete user._embed
    delete user._links
    return { ...user, group: member.group.name, role: member.role }
  })
}
