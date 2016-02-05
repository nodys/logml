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

  INTEGER, PARAMETER:: nb_nodes = <%= nbNodes %>; ! number of nodes
  INTEGER, PARAMETER:: nb_edges = <%= nbEdges %>; ! number of edges

  CHARACTER(LEN = 4), PARAMETER:: it_max_fmt = "(I4)"; ! how to output it_max

!!! node indexes
<%= nodesIndex %>


!!! egde indexes
<%= edgesIndex %>

  !contains

  !--------------------------------------------------------------------------
  ! definition of useful functions
  !--------------------------------------------------------------------------

END MODULE constants
