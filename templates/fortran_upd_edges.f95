!--------------------------------------------------------------------------------------------------
! MODULE      : lib_update_edges
! DESCRIPTION : contains a function used to update edges
!
! Copyright (C) Novadiscovery. MIT
!--------------------------------------------------------------------------------------------------

module upd_edges

    use constants
    use lib_functions

    implicit none

contains

    ! function updating edges at each iteration
    !--------------------------------------------------------------------------
    ! @param
    ! @return
    function update_edges(nodes) result(edges)
        implicit none
        real,dimension(:)::nodes
        real,dimension(:),allocatable::edges
        allocate(edges(nb_edges))
<%= edgesList %>
    end function update_edges

end module upd_edges
