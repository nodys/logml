!--------------------------------------------------------------------------------------------------
! PROGRAM     : lib_functions
! DESCRIPTION : is used to define the functions used the whole simulation
!
! Copyright (C) Novadiscovery. MIT
!--------------------------------------------------------------------------------------------------

MODULE lib_functions
  IMPLICIT NONE
  !--------------------------------------------------------------------------
  ! definition of constants & common variables
  !--------------------------------------------------------------------------
CONTAINS
  !--------------------------------------------------------------------------
  ! definition of useful functions
  !--------------------------------------------------------------------------

  ! AND
  !--------------------------------------------------------------------------
  ! @param
  ! @return
  FUNCTION AND_(x) RESULT(y)
    IMPLICIT NONE
    REAL, DIMENSION(:) :: x
    REAL               :: y
    INTEGER            :: i
    y = x(1)
    DO i = 2, SIZE(x,1)
       y = y * x(i)
    END DO
  END FUNCTION AND_

  ! NOT
  !--------------------------------------------------------------------------
  ! @param
  ! @return
  FUNCTION NOT_(x) RESULT(y)
    IMPLICIT NONE
    REAL, DIMENSION(:) :: x
    REAL               :: y
    y = 1.0 - x(1)
  END FUNCTION NOT_

  ! OR
  !--------------------------------------------------------------------------
  ! @param
  ! @return
  FUNCTION OR_(x) RESULT(y)
    IMPLICIT NONE
    REAL, DIMENSION(:) :: x
    REAL               :: y
    INTEGER            :: i
    y = x(1)
    DO i = 2, SIZE(x, 1)
       y = y + x(i) - y * x(i)
    END DO
  END FUNCTION OR_

  ! int2char
  !--------------------------------------------------------------------------
  ! @param x : an integer
  ! @return the char representation of 'x'
  FUNCTION int2char(x) RESULT(y)
    IMPLICIT NONE
    INTEGER                   :: x
    CHARACTER(:), ALLOCATABLE :: y
    CHARACTER(10)             :: n
    WRITE (unit = n, fmt = "(i10)") x
    y = TRIM(ADJUSTL(n))
  END FUNCTION int2char

  ! real2char
  !--------------------------------------------------------------------------
  ! @param
  ! @return
  FUNCTION real2char(x) RESULT(y)
    IMPLICIT NONE
    REAL         :: x
    CHARACTER(7) :: y
    WRITE (unit = y, fmt = "(F7.5)") x
  END FUNCTION real2char

  ! rand_int
  !--------------------------------------------------------------------------
  ! @param
  ! @return
  FUNCTION rand_int(a,b) RESULT(y)
    IMPLICIT NONE
    INTEGER :: a, b, y
    REAL    :: x
    CALL RANDOM_NUMBER(x)
    y = NINT(REAL(a) + x * (REAL(b) - REAL(a)))
  END FUNCTION rand_int
!--------------------------------------------------------------------------
! definition of useful subroutines
!--------------------------------------------------------------------------
  ! init_random_seed
  !--------------------------------------------------------------------------
  SUBROUTINE init_random_seed()
        implicit none
        integer,dimension(:),allocatable::seed
        integer::n,un,istat
        call random_seed(size=n)
        allocate(seed(n))
        open(newunit=un,file="/dev/urandom",access="stream",form="unformatted",action="read",status="old",iostat=istat)
        read(un) seed
        close(un)
        call random_seed(put=seed)
        deallocate(seed)
    END SUBROUTINE init_random_seed

END MODULE lib_functions
