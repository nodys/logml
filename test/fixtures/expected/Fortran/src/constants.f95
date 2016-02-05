!--------------------------------------------------------------------------------------------------
! PROGRAM     : lib_constants
! DESCRIPTION : is used to define the constants used the whole simulation
!
! Copyright (C) Novadiscovery. MIT
!--------------------------------------------------------------------------------------------------

MODULE constants

  IMPLICIT NONE

  !--------------------------------------------------------------------------
  ! definition of constants & common variables
  !--------------------------------------------------------------------------

  INTEGER, PARAMETER:: nb_nodes = 9; ! number of nodes
  INTEGER, PARAMETER:: nb_edges = 8; ! number of edges

  CHARACTER(LEN = 4), PARAMETER:: it_max_fmt = "(I4)"; ! how to output it_max

!!! node indexes
  INTEGER, PARAMETER:: NODE_PIP3                         = 1
  INTEGER, PARAMETER:: NODE_PIP2                         = 2
  INTEGER, PARAMETER:: NODE_PI3K                         = 3
  INTEGER, PARAMETER:: NODE_Insulin_receptor_substrat_1  = 4
  INTEGER, PARAMETER:: NODE_Insulin_like_GF1_receptor    = 5
  INTEGER, PARAMETER:: NODE_Insulin_receptor             = 6
  INTEGER, PARAMETER:: NODE_Insulin_like_growth_factor_1 = 7
  INTEGER, PARAMETER:: NODE_Insulin                      = 8
  INTEGER, PARAMETER:: NODE_anti_PI3K                    = 9


!!! egde indexes
  INTEGER, PARAMETER:: EDGE_PIP2__PIP3                                              = 1
  INTEGER, PARAMETER:: EDGE_PI3K__PIP2                                              = 2
  INTEGER, PARAMETER:: EDGE_Insulin_receptor_substrat_1__PI3K                       = 3
  INTEGER, PARAMETER:: EDGE_anti_PI3K__PI3K                                         = 4
  INTEGER, PARAMETER:: EDGE_Insulin_receptor__Insulin_receptor_substrat_1           = 5
  INTEGER, PARAMETER:: EDGE_Insulin_like_GF1_receptor__Insulin_receptor_substrat_1  = 6
  INTEGER, PARAMETER:: EDGE_Insulin_like_growth_factor_1__Insulin_like_GF1_receptor = 7
  INTEGER, PARAMETER:: EDGE_Insulin__Insulin_receptor                               = 8

  !contains

  !--------------------------------------------------------------------------
  ! definition of useful functions
  !--------------------------------------------------------------------------

END MODULE constants
