import Organization from '../models/Organization.js'

export const createOrganization = async (
      req,
      res,
      next,
    ) => {
      try {
        const {
          name,
          description = '',
          industry = 'Other',
          email = '',
          phone = '',
          website = '',
          address = '',
        } = req.body

        const existingOrganization =
          await Organization.findOne({
            ownerId: req.user._id,
          })

        if (existingOrganization) {
          return res.status(400).json({
            success: false,
            message:
              'You already own an organization.',
          })
        }

        const organization =
          await Organization.create({
            name,
            description,
            industry,
            email,
            phone,
            website,
            address,
            ownerId: req.user._id,
          })

        return res.status(201).json({
          success: true,
          message:
            'Organization created successfully.',
          data: {
            organization,
          },
        })
      } catch (error) {
        next(error)
      }
}

export const joinOrganization = async (req, res, next) => {
  try {
    const {inviteCode} = req.body

    const organization = await Organization.findOne({
      inviteCode: inviteCode.toUpperCase(),
      status: 'active',
    })

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found.',
      })
    }

    const alreadyMember = organization.members.some(
      member => member.userId.toString() === req.user._id.toString(),
    )

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this organization.',
      })
    }

    organization.members.push({
      userId: req.user._id,
      role: 'member',
    })

    await organization.save()

    return res.status(200).json({
      success: true,
      message: 'Joined organization successfully.',
      data: {
        organization,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getMyOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findOne({
      'members.userId': req.user._id,
    }).populate(
      'members.userId',
      'name email',
    )

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found.',
      })
    }

    return res.status(200).json({
      success: true,
      data: {
        organization,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const updateOrganization = async (
  req,
  res,
  next,
) => {
  try {
    const organization =
      await Organization.findOne({
        ownerId: req.user._id,
      })

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found.',
      })
    }

    const allowedFields = [
      'name',
      'description',
      'industry',
      'email',
      'phone',
      'website',
      'address',
      'status',
    ]

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        organization[field] = req.body[field]
      }
    })

    await organization.save()

    return res.status(200).json({
      success: true,
      message:
        'Organization updated successfully.',
      data: {
        organization,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getOrganizationMembers = async (
  req,
  res,
  next,
) => {
  try {
    const organization = await Organization.findOne({
      'members.userId': req.user._id,
    }).populate(
      'members.userId',
      'name email',
    )

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found.',
      })
    }

    return res.status(200).json({
      success: true,
      data: {
        members: organization.members,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const removeMember = async (req, res, next) => {
  try {
    const {userId} = req.params

    const organization = await Organization.findOne({
      ownerId: req.user._id,
    })

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found.',
      })
    }

    organization.members = organization.members.filter(
      member =>
        member.userId.toString() !== userId,
    )

    await organization.save()

    return res.status(200).json({
      success: true,
      message: 'Member removed successfully.',
      data: {
        organization,
      },
    })
  } catch (error) {
    next(error)
  }
}