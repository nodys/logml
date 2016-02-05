!--------------------------------------------------------------------------------------------------
! MODULE      : lib_update_nodes
! DESCRIPTION : contains a function used to update nodes
!
! Copyright (C) Novadiscovery. MIT
!--------------------------------------------------------------------------------------------------

module upd_nodes
    use constants
    use lib_functions
    implicit none
contains
    ! function updating nodes at each iteration
    !--------------------------------------------------------------------------
    ! @param
    ! @return
    function update_nodes(edges, nodes_0) result(nodes)
        implicit none
        real, dimension(:)::edges,  nodes_0
        real, dimension(:), allocatable::nodes
        allocate(nodes(nb_nodes))
<%= nodesList %>
    end function update_nodes

end module upd_nodes
