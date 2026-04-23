import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Obter visão geral das estatísticas do sistema' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas com sucesso.' })
  getOverview() {
    return this.adminService.getOverview();
  }

  @Get('reports')
  @ApiOperation({ summary: 'Obter trilha de auditoria (logs do sistema)' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  @ApiQuery({ name: 'search', required: false, description: 'Pesquisar por rota ou autor' })
  @ApiQuery({ name: 'method', required: false, enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] })
  @ApiResponse({ status: 200, description: 'Logs de auditoria retornados com sucesso.' })
  getReports(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('method') method?: string,
  ) {
    return this.adminService.getReports(page, limit, search, method);
  }
}
